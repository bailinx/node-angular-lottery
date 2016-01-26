'use strict';

var SocketUser = {},
    notSendPeo = [],
    notRecivePeo = [],
    hasSendPeo = [],
	async = require('async'),
    userModel = require('../models/user'),
    logger = require('../utils/log').logger;

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
                        SocketUser.getNotSendPeo(function() {
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
                        if(notRecivePeo[rdmIdx]._id.id == data[0]._id.id) {
                            if(notSendPeo.length == 1) {
                                socket.emit('system.info', {'msg': '抱歉，只剩你一个人啦~'});
                            } else {
                                while(notRecivePeo[rdmIdx]._id.id != data[0]._id.id) {
                                    rdmIdx = parseInt((Math.random()*notSendPeo.length), 10)
                                }
                                lotteryHelper(socket, rdmIdx, data[0]);
                            }
                        } else {
                            lotteryHelper(socket, rdmIdx, data[0]);
                        }
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
	// async http://blog.csdn.net/jiangcs520/article/details/17350927
	// 流程控制
	async.waterfall([
		function (cb) {
            // 获取用户信息，确定没有送出礼物
			userModel.getByQuery({_id: userInfo._id, 'sendPeo': {$exists:false}}, function(err, data){
				if(err || data.length == 0) {
                    cb("你已经送过礼物啦~");
                } else {
                    cb(err, data);
                }
			});
		},
        function (data, cb) {
            // 获取收礼物用户的信息，确定没有收到礼物
            userModel.getByQuery({_id: notRecivePeo[rdmIdx]._id, 'recivePeo': {$exists:false}}, function(err, data){
                if(err || data.length == 0) {
                    cb("TA已经收到礼物啦，换个姿势，再来一次~");
                } else {
                    cb(err, data);
                }
            });
        },
        function (data, cb) {
            // 更新送礼物信息
            userModel.update({_id: userInfo._id}, {$set: {sendPeo: notRecivePeo[rdmIdx]}}, {}, function(err) {
                logger.info("送礼物：" + userInfo.name + " -> " + notRecivePeo[rdmIdx].name);
                cb(err, null);
            });
        },
        function (data, cb) {
            // 更新收礼物信息
            userModel.update({_id: notRecivePeo[rdmIdx]._id}, {$set: {recivePeo: userInfo}}, {}, function(err) {
                logger.info(notRecivePeo[rdmIdx].name+ "收到[" + userInfo.name + "]的礼物" );
                cb(err, null);
            });
        }
	], function(err, result) {
        if(err) {
            socket.emit('system.info', { 'msg' : err});
        } else {
            // 完成之后的处理
            var link = [];
            link.push(notRecivePeo[rdmIdx]);
            link.push(userInfo);
            socket.emit('user.lottery.new', link);

            // 删除未收到礼物的缓存
            notRecivePeo.splice(rdmIdx, 1);
            // 删除未送礼物的缓存
            for(var i = 0; i < notSendPeo.length; i++) {
                if(notSendPeo[i]._id.id == userInfo._id.id) {
                    notSendPeo.splice(i, 1);
                }
            }
            logger.info("当前未收到礼物的还有:" + notRecivePeo);
            logger.info("当前未送出礼物的还有:" + notSendPeo);
            // 广播
            socket.broadcast.emit('user.lottery.new', link);
        }
	});
}
/**
 * 查询没送礼物的人
 * @param currentUser
 * @param callback
 */
SocketUser.getNotSendPeo = function(callback) {
    notSendPeo = [];
    userModel.getByQuery({'sendPeo': {$exists:false}}, function (err, list) {
        if(!err) {
            // 除去自己
            //for(var i = 0; i < list.length; i++) {
            //    if(list[i]._id.id == currentUser._id.id) {
            //        list.splice(i, 1);
            //    }
            //}
            // 未送出礼物列表
            notSendPeo = list;
            logger.info("初始化未送出礼物的人:" + list.length);
            logger.info(list);
            if(callback) callback(null, list);
        } else {
            if(callback) callback(err, null);
        }
    })
}
/**
 * 查询未收到礼物的人
 * @param currentUser
 * @param callback
 */
SocketUser.getNotRecivePeo = function(callback) {
    notRecivePeo = [];
    // 查询没收到礼物的人
    userModel.getByQuery({'recivePeo': {$exists:false}}, function (err, list) {
        if(!err) {
            // 除去自己
            //for(var i = 0; i < list.length; i++) {
            //    if(list[i]._id.id == currentUser._id.id) {
            //        list.splice(i, 1);
            //    }
            //}
            // 未送出礼物列表
            notRecivePeo = list;
            logger.info("初始化未收到礼物的人:" + list.length);
            logger.info(list);

            if(callback) callback(null, list);
        } else {
            if(callback) callback(err, null);
        }
    })
}
module.exports = SocketUser;