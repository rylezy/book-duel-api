const { matchedData } = require('express-validator');
const service = require('../services/question-set.service');

function toJson(q) {
  return {
    id: q.question_set_id,
    title: q.title,
    description: q.description,
    subject: q.subject,
    grade_level: q.grade_level,
    host_id: q.host_id,
    created_at: q.created_at,
  };
}

async function list(req, res) {
  const sets = await service.list(req.user);
  res.json(sets.map(toJson));
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  res.status(201).json(toJson(await service.create(data, req.user)));
}

async function get(req, res) {
  const { id } = matchedData(req);
  res.json(toJson(await service.get(id, req.user)));
}

async function update(req, res) {
  const { id, ...changes } = matchedData(req);
  res.json(toJson(await service.update(id, changes, req.user)));
}

async function remove(req, res) {
  const { id } = matchedData(req);
  await service.remove(id, req.user);
  res.status(204).end();
}

module.exports = { list, create, get, update, remove };