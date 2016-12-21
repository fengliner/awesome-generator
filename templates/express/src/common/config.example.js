'use strict';

// 配置文件
module.exports = {
  // 监听端口
  port: 3000,

  // 请求超时时间
  timeout: 10,

  // 缓存
  cache: {
    host: '127.0.0.1',
    port: 6379,
    time: 60,
  },
  
  // 数据库
  db: require('./config.db.js').production,
};
