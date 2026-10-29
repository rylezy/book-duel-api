const repo = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

async function findOrFail(id) {
  const questionSet = await repo.findById(id);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  }
  return questionSet;
}

// Rule: only the owner may touch a set. Missing is 404, not yours is 403.
async function findOwned(id, user) {
  const questionSet = await findOrFail(id);
  if (questionSet.host_id !== user.user_id) {
    throw forbidden('This question set belongs to another host.');
  }
  return questionSet;
}

const list = (user) => repo.findAllByHost(user.user_id);

// Rule: the owner is the caller. A client never chooses it.
const create = (data, user) => repo.create({ ...data, host_id: user.user_id });

const get = (id, user) => findOwned(id, user);

async function update(id, changes, user) {
  const questionSet = await findOwned(id, user);
  return repo.update(questionSet, changes);
}

async function remove(id, user) {
  const questionSet = await findOwned(id, user);
  await repo.remove(questionSet);
}

module.exports = { list, create, get, update, remove };