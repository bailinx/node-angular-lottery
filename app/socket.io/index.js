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

    io.listen(server);
    logger.info(Namespaces);
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
    socket.on('user.notSendList', function(data) {
        Namespaces.user.notSendList(socket);
    });
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
function onMessage(socket, payload) {
    logger.info("-=---------");
    if(!payload.data.length) {
        return logger.warn('[socket.io] 消息为空');
    }
    var eventName = payload.data[0];
    var params = payload.data[1];
    var callback = typeof payload.data[payload.data.length - 1] === 'function' ? payload.data[payload.data.length - 1] : function() {};
    logger.info("xxxx-" + eventName + params);
    if (!eventName) {
        return logger.warn('[socket.io] 方法名为空');
    }

    var parts = eventName.toString().split('.'),
        methodToCall = parts.reduce(function(prev, cur) {
            if (prev !== null && prev[cur]) {
                return prev[cur];
            } else {
                return null;
            }
        }, Namespaces);

    if(!methodToCall) {
        if (config.env === 'development') {
            logger.warn('[socket.io] Unrecognized message: ' + eventName);
        }
        return;
    }

    methodToCall(socket, params, function(err, data) {
        callback(err, data);
    });

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