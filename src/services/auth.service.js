'use strict';

const userRepository = require('../repositories/user.repository');
const password = require('../security/password');
const token = require('../security/token');
const env = require('../config/env');
const { unauthorized } = require('../errors/app-error');

// Only these account fields may leave the service.
function toPublicUser(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
}

async function register({
  school_id,
  full_name,
  email,
  password: plainPassword,
}) {
  const password_hash = await password.hash(plainPassword);

  const user = await userRepository.create({
    school_id,
    full_name,
    email,
    password_hash,
    role: 'PLAYER',
  });

  return toPublicUser(user);
}

async function login({ school_id, password: plainPassword }) {
  const user = await userRepository.findForLogin(school_id);

  // The password helper uses a dummy hash for unknown accounts.
  const valid = await password.matches(
    plainPassword,
    user ? user.password_hash : null
  );

  if (!user || !valid) {
    throw unauthorized(
      'Invalid school ID or password.',
      'INVALID_CREDENTIALS'
    );
  }

  return {
    token: token.issue(user),
    token_type: 'Bearer',
    expires_in: env.jwt.expiresIn,
    user: toPublicUser(user),
  };
}

module.exports = { register, login, toPublicUser };