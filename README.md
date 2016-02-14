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

# License
MIT
