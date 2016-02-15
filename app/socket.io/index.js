'use strict';

var SocketIO = require('socket.io'),
    Sockets = {},
    Namespaces = {},
    config = require('../config/config'),
    logger = require('../utils/log').logger,
    io;

Sockets.init = function (server) {
    requireModules();
    io = new SocketIO();
    io.on('connection', onConnection);
    // 初始化奖池数据
    Namespaces.user.getNotSendPeo();
    Namespaces.user.getNotRecivePeo();

    io.listen(server);
    Sockets.server = io;
};

Sockets.getSocketCount = function() {
    if (!io) {
        return 0;
    }
    return Object.keys(io.sockets.sockets).length;
};

function onConnection(socket)
{
    socket.ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

    logger.info(socket.ip + ' has been connected.');

    socket.on('disconnect', function(data) {
        onDisconnect(socket, data);
    });

    /* user */
    //socket.on('user.notSendList', function(data) {
    //    Namespaces.user.notSendList(socket);
    //});

	// 已经送礼物的用户
    socket.on('user.hasSendList', function(data) {
        Namespaces.user.hasSendList(socket);
    });
	// 所有用户
    socket.on('user.getAll', function(data) {
        Namespaces.user.getAll(socket);
    });
	// 用户信息
    socket.on('user.info', function(data) {
        Namespaces.user.userInfo(socket, data);
    });

	/* 抽奖 */
	socket.on('user.lottery', function(id) {
		Namespaces.user.lottery(socket, id);
	});
}

// 加载所有模块
function requireModules() {
    var modules = ['user'];
    modules.forEach(function(module) {
        Namespaces[module] = require('./' + module);
    })
}

function onDisconnect(socket, data) {
    if (socket.uid) {
        var socketCount = Sockets.getSocketCount(socket.uid);
        if (socketCount <= 1) {
            socket.broadcast.emit('user_disconnected', {uid: socket.uid, status: 'offline'});
        }
    }
}

module.exports = Sockets;