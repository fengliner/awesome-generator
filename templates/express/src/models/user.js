'use strict';

// 引用
let util = require('util');
let Base = require('./base');

let Model = function() {
  this.orm = require('./schemas/user');
};
util.inherits(Model, Base);
module.exports = new Model();

Model.prototype.getById = function*(id) {
  let user = yield models.user.get({id: id});
  return user;
};
  