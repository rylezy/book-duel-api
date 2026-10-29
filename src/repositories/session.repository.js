const { Session } = require('../models');

const findByCode = (code) => Session.findOne({ where: { join_code: code } });
const create = (data) => Session.create(data);
const update = (session, changes) => session.update(changes);

module.exports = { findByCode, create, update };