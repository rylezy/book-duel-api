'use strict';

const { body, param } = require('express-validator');

// Shared checks for required text fields.
function requiredText(field) {
  return body(field)
    .exists().withMessage(`${field} is required`).bail()
    .isString().withMessage(`${field} must be text`).bail();
}

const registerRules = [
  requiredText('school_id')
    .trim()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage('school_id must follow the 0000-0000 format'),

  requiredText('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('full_name must be 2 to 100 characters long'),

  requiredText('email')
    .trim()
    .isLength({ max: 255 })
    .withMessage('email must be at most 255 characters long').bail()
    .isEmail()
    .withMessage('email must be a valid email address'),

  requiredText('password')
    .isLength({ min: 8, max: 72 })
    .withMessage('password must be 8 to 72 characters long').bail()
    .isByteLength({ max: 72 })
    .withMessage('password must be at most 72 UTF-8 bytes').bail()
    .matches(/[A-Za-z]/)
    .withMessage('password must contain a letter').bail()
    .matches(/[0-9]/)
    .withMessage('password must contain a number'),
];

const loginRules = [
  requiredText('school_id')
    .trim()
    .notEmpty()
    .withMessage('school_id is required'),

  requiredText('password')
    .notEmpty()
    .withMessage('password is required'),
];

const roleRules = [
  param('id')
    .isInt({ min: 1, max: 2147483647 })
    .withMessage('id must be a positive 32-bit integer').bail()
    .toInt(),

  requiredText('role')
    .isIn(['PLAYER', 'HOST', 'ADMIN'])
    .withMessage('role must be PLAYER, HOST, or ADMIN'),
];

module.exports = { registerRules, loginRules, roleRules };