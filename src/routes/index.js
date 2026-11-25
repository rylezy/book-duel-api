'use strict';

const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Hub endpoints have their own access rules.
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

// Registration and login are public.
// /auth/me checks its own token.
router.use('/auth', require('./auth.routes'));

// Read the caller's token once for the remaining modules.
router.use(currentUser);

router.use('/question-sets', require('./question-set.routes'));
router.use('/sessions', require('./session.routes'));

module.exports = router;