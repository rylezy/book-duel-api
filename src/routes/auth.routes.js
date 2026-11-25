'use strict';

const { Router } = require('express');
const currentUser = require('../middlewares/current-user');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/auth.validator');
const controller = require('../controllers/auth.controller');

const router = Router();

router.post(
  '/register',
  rules.registerRules,
  validate,
  controller.register
);

router.post(
  '/login',
  rules.loginRules,
  validate,
  controller.login
);

router.get(
  '/me',
  currentUser,
  requireUser(),
  controller.me
);

module.exports = router;