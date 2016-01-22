'use strict';
module.exports = {
    name                    : 'angular-lottery',
    /* production: 生产环境 development: 开发环境 */
    env                     : 'development',
    port                    : 3000,
    cookieSecret            : 'angular-lottery',// cookie密钥
    connectionString        : 'mongodb://localhost/lottery'
}
