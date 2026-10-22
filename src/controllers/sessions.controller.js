const sessionsService = require('../services/sessions.service');

async function listSessions(req, res) {
  const sessions = await sessionsService.listSessions();
  res.status(200).json(sessions);
}

async function getSession(req, res) {
  const session = await sessionsService.getSession(req.params.id);
  res.status(200).json(session);
}

async function createSession(req, res) {
  const session = await sessionsService.createSession(req.body);
  res.status(201).json(session);
}

async function updateSession(req, res) {
  const session = await sessionsService.updateSession(
    req.params.id,
    req.body,
  );

  res.status(200).json(session);
}

async function deleteSession(req, res) {
  await sessionsService.deleteSession(req.params.id);
  res.status(204).send();
}

module.exports = {
  listSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
};
