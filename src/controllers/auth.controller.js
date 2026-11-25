'use strict';

const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');

async function register(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const user = await authService.register(data);

  res.status(201).json({ user });
}

async function login(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const result = await authService.login(data);

  res.status(200).json(result);
}

function me(req, res) {
  res.status(200).json({
    user: authService.toPublicUser(req.account),
  });
}

module.exports = { register, login, me };