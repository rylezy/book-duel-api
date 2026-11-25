'use strict';

const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const { roleRules } = require('../validators/auth.validator');
const controller = require('../controllers/user.controller');

const router = Router();

// Check permissions before validating inputs.
router.use(requireUser('ADMIN'));

router.get('/', controller.list);

router.patch(
  '/:id/role',
  roleRules,
  validate,
  controller.changeRole
);

module.exports = router;