const { Op } = require('sequelize');
const { Player, Session } = require('../models');

const findSeat = (sessionId, userId) =>
  Player.findOne({ where: { session_id: sessionId, user_id: userId } });

const countBySession = (sessionId) =>
  Player.count({ where: { session_id: sessionId } });

const create = (data) => Player.create(data);

const listBySession = (sessionId) =>
  Player.findAll({
    where: { session_id: sessionId },
    order: [['score', 'DESC'], ['session_player_id', 'ASC']],
  });

// A seat of this account in ANOTHER game that is playing, or null.
const findPlayingSeatElsewhere = (userId, sessionId) =>
  Player.findOne({
    where: { user_id: userId, session_id: { [Op.ne]: sessionId } },
    include: [{ model: Session, where: { status: 'playing' }, attributes: ['join_code'] }],
  });

module.exports = {
  findSeat, countBySession, create, listBySession, findPlayingSeatElsewhere,
};