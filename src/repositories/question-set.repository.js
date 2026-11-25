'use strict';

const { Op } = require('sequelize');
const { QuestionSet } = require('../models');
const { toOffset } = require('../utils/paginate');

function findAllByHost(hostId, options = {}) {
  const {
    q = '',
    subject,
    grade_level,
    sort = 'question_set_id',
    order = 'asc',
  } = options;

  // Every query stays restricted to the logged-in host.
  const where = { host_id: hostId };

  if (q) {
    const pattern = `%${q}%`;

    where[Op.or] = [
      { title: { [Op.iLike]: pattern } },
      { description: { [Op.iLike]: pattern } },
      { subject: { [Op.iLike]: pattern } },
      { grade_level: { [Op.iLike]: pattern } },
    ];
  }

  if (subject) {
    where.subject = subject;
  }

  if (grade_level) {
    where.grade_level = grade_level;
  }

  const sorting = [[sort, order.toUpperCase()]];

  // Keep ordering stable when titles or creation dates match.
  if (sort !== 'question_set_id') {
    sorting.push(['question_set_id', 'ASC']);
  }

  return QuestionSet.findAndCountAll({
    where,
    ...toOffset(options),
    order: sorting,
  });
}

const findById = (id) => QuestionSet.findByPk(id);

const create = (data) => QuestionSet.create(data);

const update = (questionSet, changes) =>
  questionSet.update(changes);

const remove = (questionSet) => questionSet.destroy();

module.exports = {
  findAllByHost,
  findById,
  create,
  update,
  remove,
};