const { Router } = require('express');
const sessionsController = require('../controllers/sessions.controller');

const router = Router();

router.get('/', sessionsController.listSessions);
router.get('/:id', sessionsController.getSession);
router.post('/', sessionsController.createSession);
router.patch('/:id', sessionsController.updateSession);
router.delete('/:id', sessionsController.deleteSession);

module.exports = router;
