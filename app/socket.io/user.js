'use strict';

var SocketUser = {},
    notSendPeo = [],
    hasSendPeo = [],
    userModel = require('../models/user');

// 初始化奖池
SocketUser.init = function (callback) {
    notSendPeo = [];
    userModel.find({}).populate('sendUserID').exec(function(err,docs){
        console.log(docs);
        callback(err, docs);
    })
}

SocketUser.getAll = function (socket) {
    userModel.getAll(function(err, data){
        if(!err) {
            socket.emit('user.getAll.repley', data);
        } else {
            socket.emit('error', {'msg': '赠送列表获取失败'});
        }
    });
}

SocketUser.notSendList = function (socket) {
    if(!notSendPeo) {
        SocketUser.init(function() {
            socket.emit('user.notSendList.repley', notSendPeo);
        });
    } else {
        socket.emit('user.notSendList.repley', notSendPeo);
    }
}

SocketUser.hasSendList = function (socket) {
    userModel.find({'hasSend': {$not: {$size: 0}}}, function(err, data){
        if(!err) {
            socket.emit('user.hasSendList.repley', data);
        } else {
            socket.emit('error', {'msg': '赠送列表获取失败'});
        }
    });
}

module.exports = SocketUser;