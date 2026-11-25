'use strict';

const { body, param } = require('express-validator');
const {
  pageRules,
  sortRules,
  queryText,
} = require('./list.validator');

const idParam = [
  param('id')
    .isInt({ min: 1, max: 2147483647 })
    .withMessage('id must be a positive 32-bit integer').bail()
    .toInt(),
];

const listRules = [
  ...pageRules,

  ...sortRules([
    'question_set_id',
    'title',
    'created_at',
  ]),

  queryText('q')
    .trim()
    .isLength({ max: 100 })
    .withMessage('q must be at most 100 characters long'),

  queryText('subject')
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('subject must be 1 to 60 characters long'),

  queryText('grade_level')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('grade_level must be 1 to 30 characters long'),
];

const title = (required) => {
  let chain = body('title');

  if (required) {
    chain = chain.exists()
      .withMessage('title is required')
      .bail();
  } else {
    chain = chain.optional();
  }

  return chain
    .isString().withMessage('title must be text').bail()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage('title must be 3 to 80 characters long');
};

const optionalText = (field, max) => body(field)
  .optional({ values: 'null' })
  .isString().withMessage(`${field} must be text`).bail()
  .trim()
  .isLength({ max })
  .withMessage(`${field} must be at most ${max} characters long`);

const fields = [
  optionalText('description', 255),
  optionalText('subject', 60),
  optionalText('grade_level', 30),
];

const createRules = [title(true), ...fields];
const updateRules = [...idParam, title(false), ...fields];

module.exports = {
  idParam,
  listRules,
  createRules,
  updateRules,
};