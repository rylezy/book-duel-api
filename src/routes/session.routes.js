
const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/session.validator');
const sessionController = require('../controllers/session.controller');

const router = Router();

router.post('/', requireUser('host'),
  rules.createRules, validate, sessionController.create);
router.get('/:code', rules.codeParam, validate, sessionController.get);
router.patch('/:code', requireUser('host'),
  rules.statusRules, validate, sessionController.changeStatus);

// player routes (join, list) are added here next

module.exports = router;