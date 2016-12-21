'use strict';

let User = function() {};
module.exports = new User();

User.prototype.getUserById = function*(req, params, res) {
  let user = yield models.user.getById(params.id);
  return user;
}
