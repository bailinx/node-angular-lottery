# node-angular-lottery

使用X-MEAN-SEED构建的新年抽奖项目

[node-angular-lottery](https://github.com/radishj/node-angular-lottery)
![](https://github.com/radishj/node-angular-lottery/blob/master/public/upload/demo.gif?raw=true)

----------

# Introduction:

- New Year's lottery project，used node/angular/socket.io
- Use mongo database，Only one collection
- You can change the port information such as website at app/config/config.js
- CreateUser URL : IP:Port/#/sys/userCreate

# Requirements

node-angular-lottery requires the following software to be installed:

- A version of Node.js at least 0.10 or greater
- MongoDB, version 2.6 or greater

# Installation

**install dependencies**

```bash
$ npm install
$ bower install
```

**build project**

```bash
// clean
$ gulp clean

// watch
$ gulp watch

// build project
$ gulp build
```

**start mongodb**

```bash
mongod --dbpath=dbpath --logpath=logpath
```

**start project**

```bash
cd bin
node www
```

# Notices

- 开发请配置项目环境config.js中`env`:`development`,部署请改为`production`
- 测试使用`amd-optimize`打包时，会遇到`Error: A module must not have more than one anonymous 'define' calls.`,具体问题请看[Issues#690](https://github.com/socketio/socket.io-client/issues/690),
我的解决办法是打包按照`JamesHenry`的办法删除那两段代码，就OK，因为这是练习项目，用了三种打包方案（r.js/gulp-requirejs/amd-optimize），
其他两种未测试是否有这问题.(后面想了想，删除代码并不好，r.js都是跟require一同发布，应该不会出现这问题，amd-optimize遇到的坑)

# License
MIT
