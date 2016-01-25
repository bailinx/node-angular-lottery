'use strict';

var SocketUser = {},
    notSendPeo = [],
    hasSendPeo = [],
    userModel = require('../models/user');

// 初始化奖池
SocketUser.init = function (currentUser, callback) {
    notSendPeo = [];
    userModel.getByQuery({'hasSend': 0}, function (err, list) {
	    if(!err) {
		    // 除去自己
		    for(var i = 0; i < list.length; i++) {
			    if(list[i]._id.id == currentUser._id.id) {
				    list.splice(i, 1);
			    }
		    }
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
            socket.emit('system.error', {'msg': '赠送列表获取失败'});
        }
    });
}

// 未送出礼物列表
//SocketUser.notSendList = function (socket) {
//    if(!notSendPeo) {
//        SocketUser.init(function() {
//            socket.emit('user.notSendList.repley', notSendPeo);
//        });
//    } else {
//        socket.emit('user.notSendList.repley', notSendPeo);
//    }
//}

// 已经送出礼物的列表
SocketUser.hasSendList = function (socket) {
    userModel.getByQuery({'hasSend': 1}, function(err, data){
        if(!err) {
	        hasSendPeo = data;
            socket.emit('user.hasSendList.repley', data);
        } else {
            socket.emit('system.error', {'msg': '赠送列表获取失败'});
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
				socket.emit('system.error', {'msg': '用户不存在'});
			}
		});
	} else {
		userModel.getByQuery({'ip': socket.ip}, function(err, data){
			if(!err) {
				socket.emit('user.info.repley', data);
			} else {
				socket.emit('system.error', {'msg': 'IP不存在'});
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
					if(notSendPeo.length == 0) {
						SocketUser.init(data[0], function() {
							socket.emit('system.info', {'msg': '奖池为空啦，再抽一次试试~'});
							// 奖池还是为空
							//if(notSendPeo.length == 0) {
							//	socket.emit('system.error', {'msg': '奖池为空啦~ 嘿嘿'});
							//} else {
							//	var rdmIdx = parseInt((Math.random()*notSendPeo.length), 10);
							//	lotteryHelper(socket, rdmIdx, data[0]);
							//}
						});

					} else {
						var rdmIdx = parseInt((Math.random()*notSendPeo.length), 10);
						lotteryHelper(socket, rdmIdx, data[0]);
						//socket.emit('user.lottery.repley', data[0]);
					}
				} else {
					socket.emit('system.error', {'msg': '用户不存在'});
				}
			} else {
				socket.emit('system.error', {'msg': '用户不存在'});
			}
		});
	}
}
/**
 * 处理送礼物的流程
 * @param socket
 * @param rdmIdx
 * @param userInfo
 */
function lotteryHelper(socket, rdmIdx, userInfo) {
	var link = [];
	link.push(notSendPeo[rdmIdx]);
	link.push(userInfo);
	socket.emit('user.lottery.new', link);
	// 广播
	socket.broadcast.emit('user.lottery.new', link);
	notSendPeo.splice(rdmIdx, 1);
}

module.exports = SocketUser;