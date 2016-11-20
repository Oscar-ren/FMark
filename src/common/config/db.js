'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  adapter: {
    mysql: {
      host: '10.120.253.177',
      port: '3474',
      database: 'duanyuwen',
      user: 'duanyuwen',
      password: 'Duanyuwen2015',
      prefix: 'mark_',
      encoding: 'utf8'
    },
    mongo: {

    }
  }
};
