const { Session } = require('../models');

function listSessions() {
  return Session.findAll({
    order: [['session_id', 'ASC']],
  });
}

function findSessionById(id) {
  return Session.findByPk(id);
}

function createSession(data) {
  return Session.create(data);
}

function updateSession(session, changes) {
  return session.update(changes);
}

function deleteSession(session) {
  return session.destroy();
}

module.exports = {
  listSessions,
  findSessionById,
  createSession,
  updateSession,
  deleteSession,
};
