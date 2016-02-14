'use strict';
module.exports = {
    name                    : 'node-angular-lottery',
    /* production: 生产环境 development: 开发环境 */
    env                     : 'production',
    port                    : 3000,
    cookieSecret            : 'angular-lottery',// cookie密钥
    connectionString        : 'mongodb://localhost/lottery',
	uplpadDir               : '../public/upload/'
}
