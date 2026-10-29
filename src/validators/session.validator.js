const { body, param } = require('express-validator');

const codeParam = [
  param('code').matches(/^[1-9][0-9]{5}$/)
    .withMessage('the join code must be six digits'),
];

const createRules = [
  body('question_set_id')
    .exists().withMessage('question_set_id is required').bail()
    .isInt({ min: 1 }).withMessage('question_set_id must be a positive whole number')
    .toInt(),
];

const statusRules = [
  ...codeParam,
  body('status')
    .exists().withMessage('status is required').bail()
    .isIn(['playing', 'ended']).withMessage('status must be playing or ended'),
];

module.exports = { codeParam, createRules, statusRules };