const sessionsRepository = require('../repositories/sessions.repository');

const editableFields = [
  'host_id',
  'question_set_id',
  'join_code',
  'status',
  'end_reason',
  'started_at',
  'ended_at',
];

function createError(message, status = 400, code = 'BAD_REQUEST') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function parseId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(
      'id must be a positive integer.',
      400,
      'INVALID_ID',
    );
  }

  return id;
}

async function listSessions() {
  return sessionsRepository.listSessions();
}

async function getSession(idValue) {
  const id = parseId(idValue);
  const session = await sessionsRepository.findSessionById(id);

  if (!session) {
    throw createError(
      'Session not found.',
      404,
      'SESSION_NOT_FOUND',
    );
  }

  return session;
}

async function createSession(data) {
  if (!data || !Number.isInteger(data.host_id)) {
    throw createError('host_id must be an integer.');
  }

  if (!data || !Number.isInteger(data.question_set_id)) {
    throw createError('question_set_id must be an integer.');
  }

  if (!/^[1-9][0-9]{5}$/.test(data.join_code || '')) {
    throw createError(
      'join_code must be a six-digit number that does not start with zero.',
    );
  }

  return sessionsRepository.createSession({
    host_id: data.host_id,
    question_set_id: data.question_set_id,
    join_code: data.join_code,
    status: 'waiting',
  });
}

async function updateSession(idValue, data) {
  const session = await getSession(idValue);
  const changes = {};

  for (const field of editableFields) {
    if (data && data[field] !== undefined) {
      changes[field] = data[field];
    }
  }

  if (Object.keys(changes).length === 0) {
    throw createError('At least one editable field is required.');
  }

  return sessionsRepository.updateSession(session, changes);
}

async function deleteSession(idValue) {
  const session = await getSession(idValue);
  await sessionsRepository.deleteSession(session);
}

module.exports = {
  listSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
};
