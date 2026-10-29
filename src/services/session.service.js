const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // never starts with 0
}

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No game has the code ${code}.`);
  }
  return session;
}

// Rules: the question set must exist and be the caller's.
// The host is the caller. The server makes the code.
async function create({ question_set_id }, user) {
  const questionSet = await questionSetRepository.findById(question_set_id);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND',
      `No question set has the id ${question_set_id}.`);
  }
  if (questionSet.host_id !== user.user_id) {
    throw forbidden('This question set belongs to another host.');
  }

  let code;
  do {
    code = generateCode();
  } while (await sessionRepository.findByCode(code));
  // The unique constraint is still the last guard if two requests collide.

  return sessionRepository.create({
    host_id: user.user_id,
    question_set_id,
    join_code: code,
    status: 'waiting',
  });
}

// Rules: only the host changes status, and only forward.
// waiting -> playing, waiting or playing -> ended.
async function changeStatus(code, status, user) {
  const session = await findOrFail(code);

  if (session.host_id !== user.user_id) {
    throw forbidden('This game belongs to another host.');
  }
  if (session.status === 'ended') {
    throw conflict('SESSION_ENDED', 'This game has already ended.');
  }
  if (status === 'playing' && session.status !== 'waiting') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }

  if (status === 'playing') {
    return sessionRepository.update(session,
      { status: 'playing', started_at: new Date() });
  }
  // All three fields together, or your CHECK constraints reject it.
  return sessionRepository.update(session,
    { status: 'ended', ended_at: new Date(), end_reason: 'host_ended' });
}

module.exports = { findOrFail, create, changeStatus };