const { body } = require('express-validator');
const { codeParam } = require('./session.validator');

const joinRules = [
  ...codeParam,
  body('nickname')
    .exists().withMessage('nickname is required').bail()
    .isString().withMessage('nickname must be text').bail()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('nickname must be 2 to 20 characters long'),
];

module.exports = { joinRules, codeParam };