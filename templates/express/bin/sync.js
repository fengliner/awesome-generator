'use strict';

// 引用
const co = require('co');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const func = require('../src/common/func');
const config = require('../src/common/config');
config.db = require('../src/common/config.db').production;

// 连接数据库
const db = new Sequelize(config.db.database, config.db.username, config.db.password, {
  dialect: config.db.dialect,
  host: config.db.host,
  port: config.db.port,
  timezone: '+08:00',
  pool: {
    maxConnections: config.db.pool,
  },
  omitNull: true,
  logging: false,
});

// 加载schemas
co(function *() {
  const queryInterface = db.getQueryInterface();
  const tables = yield queryInterface.showAllTables();
  for (let i = 0; i < tables.length; i++) {
    if (tables[i].substr(0, config.db.prefix.length) !== config.db.prefix) {
      continue;
    }

    // 获取名称
    let name = tables[i].substr(config.db.prefix.length);
    name = name.replace(/(_.)/g, word => {
      return word[1].toUpperCase();
    });

    // 获取属性
    const attributes = yield queryInterface.describeTable(tables[i]);
    let schema = '';
    schema += '\'use strict\';\n\n';
    schema += 'let schema = db.define(\'' + name + '\', {\n';
    for (let field in attributes) {
      schema += '  ' + func.toCamel(field) + ': {\n';
      schema += '    type: \'' + attributes[field].type + '\',\n';
      schema += '    field: \'' + field + '\'\n';
      schema += '  }';
      schema += ',';
      schema += '\n';
    }
    schema += '}, {\n';
    schema += '  tableName: config.db.prefix + \'' + name + '\',\n';
    schema += '  createdAt: false,\n';
    schema += '  updatedAt: false\n';
    schema += '});\n\n'
    schema += 'module.exports = schema;\n';

    // 同步文件
    fs.writeFileSync(path.join(__dirname, '../src/models/schemas', `${name}.js`), schema);
  }
}).then(function() {
  console.log('done');
  process.exit(0);
}, function(err) {
  console.error(err.stack);
  process.exit(0);
});
