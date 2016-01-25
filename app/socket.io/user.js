'use strict';

var SocketUser = {},
    notSendPeo = [],
    userModel = require('../models/user');

// 初始化奖池
SocketUser.init = function () {
    notSendPeo = [];
    userModel.getByQuery({})
}