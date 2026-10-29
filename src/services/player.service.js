const playerRepository = require('../repositories/player.repository');
const sessionService = require('./session.service');
const { conflict } = require('../errors/app-error');

const MAX_PLAYERS = 10; // change if your design set says otherwise

async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  // Rejoin: this account already has a seat. Same row, same score.
  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) return { session, player: seat, created: false };

  // One game at a time.
  const elsewhere = await playerRepository
    .findPlayingSeatElsewhere(user.user_id, session.session_id);
  if (elsewhere) {
    throw conflict('ALREADY_IN_GAME',
      'You are still playing another game. Finish it first.');
  }

  // New seat: only while waiting, and only if there is room.
  if (session.status === 'ended') {
    throw conflict('SESSION_ENDED', 'This game has ended.');
  }
  if (session.status !== 'waiting') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }
  const seatsTaken = await playerRepository.countBySession(session.session_id);
  if (seatsTaken >= MAX_PLAYERS) {
    throw conflict('SESSION_FULL', 'This game is full.');
  }

  try {
    const player = await playerRepository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
    });
    return { session, player, created: true };
  } catch (err) {
    // Two requests from one account at the same instant: the loser gets the seat back.
    if (err.parent && err.parent.constraint === 'uq_one_seat') {
      const existing = await playerRepository.findSeat(session.session_id, user.user_id);
      return { session, player: existing, created: false };
    }
    throw err; // uq_player_nickname goes to the error handler -> NICKNAME_TAKEN
  }
}

async function list(code) {
  const session = await sessionService.findOrFail(code);
  return playerRepository.listBySession(session.session_id);
}

module.exports = { join, list };