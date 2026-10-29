const { body, param } = require('express-validator');

const idParam = [
  param('id').isInt({ min: 1 })
    .withMessage('id must be a positive whole number').toInt(),
];

const title = (required) => {
  let chain = body('title');
  if (required) {
    chain = chain.exists().withMessage('title is required').bail();
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

const fields = [optionalText('description', 255), optionalText('subject', 60),
  optionalText('grade_level', 30)];

const createRules = [title(true), ...fields];
const updateRules = [...idParam, title(false), ...fields];

module.exports = { idParam, createRules, updateRules };