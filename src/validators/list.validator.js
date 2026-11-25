'use strict';

const { query } = require('express-validator');

function queryText(field) {
  return query(field)
    .optional()
    .isString()
    .withMessage(`${field} must be a single text value`).bail()
    .not().contains('\0')
    .withMessage(`${field} must not contain null characters`).bail();
}

const pageRules = [
  queryText('page')
    .isInt({ min: 1, max: 2147483647 })
    .withMessage('page must be 1 to 2147483647').bail()
    .toInt(),

  queryText('limit')
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be 1 to 50').bail()
    .toInt(),
];

function sortRules(columns) {
  return [
    queryText('sort')
      .isIn(columns)
      .withMessage(`sort must be one of: ${columns.join(', ')}`),

    queryText('order')
      .isIn(['asc', 'desc'])
      .withMessage('order must be asc or desc'),
  ];
}

module.exports = { pageRules, sortRules, queryText };