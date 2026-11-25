'use strict';

const { matchedData } = require('express-validator');
const userService = require('../services/user.service');

async function list(req, res) {
  const users = await userService.list();
  res.status(200).json(users);
}

async function changeRole(req, res) {
  const { id, role } = matchedData(req);

  const user = await userService.changeRole(
    id,
    role,
    req.user
  );

  res.status(200).json({ user });
}

module.exports = { list, changeRole };