const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

function toJson(p) {
  return {
    player_id: p.session_player_id,
    nickname: p.nickname,
    hp: p.hp,
    score: p.score,
    is_eliminated: p.is_eliminated,
    is_winner: p.is_winner,
  };
}

async function join(req, res) {
  const { code, nickname } = matchedData(req);
  const { session, player, created } =
    await playerService.join(code, nickname, req.user);
  res.status(created ? 201 : 200).json({
    ...toJson(player),
    rejoined: !created,
    session: { code: session.join_code, status: session.status },
  });
}

async function list(req, res) {
  const { code } = matchedData(req);
  const players = await playerService.list(code);
  res.json(players.map(toJson));
}

module.exports = { join, list };