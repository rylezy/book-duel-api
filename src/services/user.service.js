'use strict';

const userRepository = require('../repositories/user.repository');
const { toPublicUser } = require('./auth.service');
const { notFound, conflict } = require('../errors/app-error');

async function list() {
  const users = await userRepository.findAll();
  return users.map(toPublicUser);
}

async function changeRole(id, role, actor) {
  if (id === actor.user_id) {
    throw conflict(
      'CANNOT_CHANGE_OWN_ROLE',
      'You cannot change your own role.'
    );
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw notFound(
      'USER_NOT_FOUND',
      'That user does not exist.'
    );
  }

  const updated = await userRepository.update(user, { role });
  return toPublicUser(updated);
}

module.exports = { list, changeRole };