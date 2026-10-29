const { QuestionSet } = require('../models');

const findAllByHost = (hostId) =>
  QuestionSet.findAll({ where: { host_id: hostId }, order: [['question_set_id', 'ASC']] });
const findById = (id) => QuestionSet.findByPk(id);
const create = (data) => QuestionSet.create(data);
const update = (questionSet, changes) => questionSet.update(changes);
const remove = (questionSet) => questionSet.destroy();

module.exports = { findAllByHost, findById, create, update, remove };