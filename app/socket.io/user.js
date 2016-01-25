'use strict';

var SocketUser = {},
    notSendPeo = [],
    hasSendPeo = [],
    userModel = require('../models/user');

// 初始化奖池
SocketUser.init = function (callback) {
    notSendPeo = [];
    userModel.getByQuery({'hasSend': 1}, function (err, list) {
	    if(!err) {
		    // 未送出礼物列表
		    notSendPeo = list;
		    callback(null, list);
	    } else {
		    callback(err, null);
	    }
    })
}

// 所有用户
SocketUser.getAll = function (socket) {
    userModel.getAll(function(err, data){
        if(!err) {
            socket.emit('user.getAll.repley', data);
        } else {
            socket.emit('error', {'msg': '赠送列表获取失败'});
        }
    });
}

// 未送出礼物列表
SocketUser.notSendList = function (socket) {
    if(!notSendPeo) {
        SocketUser.init(function() {
            socket.emit('user.notSendList.repley', notSendPeo);
        });
    } else {
        socket.emit('user.notSendList.repley', notSendPeo);
    }
}

// 已经送出礼物的列表
SocketUser.hasSendList = function (socket) {
    userModel.getByQuery({'hasSend': 1}, function(err, data){
        if(!err) {
	        hasSendPeo = data;
            socket.emit('user.hasSendList.repley', data);
        } else {
            socket.emit('error', {'msg': '赠送列表获取失败'});
        }
    });
}

// 用户信息
SocketUser.userInfo = function (socket, workNo) {
	if(workNo) {
		userModel.getByQuery({'workNo': workNo}, function(err, data){
			if(!err) {
				if(data.length != 0) {
					socket.emit('user.info.repley', data[0]);
				} else {
					socket.emit('user.info.repley', data);
				}
			} else {
				socket.emit('error', {'msg': '用户不存在'});
			}
		});
	} else {
		userModel.getByQuery({'ip': socket.ip}, function(err, data){
			if(!err) {
				socket.emit('user.info.repley', data);
			} else {
				socket.emit('error', {'msg': 'IP不存在'});
			}
		});
	}

}

SocketUser.lottery = function (socket, id) {
	if(!id) {
		socket.emit('user.lottery.repley', {'msg': '抽奖失败，用户不存在.'});
	} else {
		userModel.getByQuery({_id: id}, function(err, data){
			if(!err) {
				if(data.length > 0) {
					socket.emit('user.lottery.repley', data[0]);
				} else {
					socket.emit('error', {'msg': '用户不存在'});
				}
			} else {
				socket.emit('error', {'msg': '用户不存在'});
			}
		});
	}
}

module.exports = SocketUser;