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

    socket.on('*', function(payload) {
        onMessage(socket, payload);
    });
}

// 加载所有模块
function requireModules() {
    var modules = [];
    modules.forEach(function(module) {
        Namespaces[module] = require('./' + module);
    })
}
function onMessage(socket, payload) {
    if(!payload.data.length) {
        return logger.warn('[socket.io] 消息为空');
    }
    var eventName = payload.data[0];
    var params = payload.data[1];
    var callback = typeof payload.data[payload.data.length - 1] === 'function' ? payload.data[payload.data.length - 1] : function() {};

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
            socket.broadcast.emit('event:user_disconnected', {uid: socket.uid, status: 'offline'});
        }
    }
}

module.exports = Sockets;