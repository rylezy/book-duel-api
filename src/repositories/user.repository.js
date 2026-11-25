const { User } = require('../models');

function findBySchoolId(schoolId) {
  return User.findOne({ where: { school_id: schoolId } });
}

// Week 12: Retrieve the password hash for login verification.
function findForLogin(schoolId) {
  return User.scope('withPassword').findOne({
    where: { school_id: schoolId },
  });
}

function findById(userId) {
  return User.findByPk(userId);
}

function findAll() {
  return User.findAll({
    order: [['user_id', 'ASC']],
  });
}

function create(data) {
  return User.create(data);
}

function update(user, changes) {
  return user.update(changes);
}

module.exports = {
  findBySchoolId,
  findForLogin,
  findById,
  findAll,
  create,
  update,
};