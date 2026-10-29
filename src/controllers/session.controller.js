const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

function toJson(s) {
  return {
    code: s.join_code,
    host_id: s.host_id,
    question_set_id: s.question_set_id,
    status: s.status,
    end_reason: s.end_reason,
    created_at: s.created_at,
    started_at: s.started_at,
    ended_at: s.ended_at,
  };
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const session = await sessionService.create(data, req.user);
  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req);
  res.json(toJson(await sessionService.findOrFail(code)));
}

async function changeStatus(req, res) {
  const { code, status } = matchedData(req);
  res.json(toJson(await sessionService.changeStatus(code, status, req.user)));
}

module.exports = { create, get, changeStatus, toJson };