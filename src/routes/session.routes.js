
const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/session.validator');
const sessionController = require('../controllers/session.controller');
const playerRules = require('../validators/player.validator');
const playerController = require('../controllers/player.controller');

const router = Router();

router.post('/', requireUser('host'),
  rules.createRules, validate, sessionController.create);
router.get('/:code', rules.codeParam, validate, sessionController.get);
router.patch('/:code', requireUser('host'),
  rules.statusRules, validate, sessionController.changeStatus);

// Players are part of a game, so their URLs sit under it.
router.post('/:code/players', requireUser(),
  playerRules.joinRules, validate, playerController.join);
router.get('/:code/players', playerRules.codeParam, validate, playerController.list);
module.exports = router;