'use strict';

var SocketUser = {},
    notSendPeo = [],
    notRecivePeo = [],
	async = require('async'),
    userModel = require('../models/mapping').user,
    logger = require('../utils/log').logger;

// 所有用户
SocketUser.getAll = function (socket) {
    userModel.find({}, function(err, data){
        if(!err) {
            socket.emit('user.getAll.repley', data);
        } else {
            socket.emit('system.error', {'msg': '赠送列表获取失败'});
        }
    });
}

// 已经送出礼物的列表
SocketUser.hasSendList = function (socket) {
    userModel.find({'sendPeo': {$exists:true}}, function(err, data){
        if(!err) {
            socket.emit('user.hasSendList.repley', data);
        } else {
            socket.emit('system.error', {'msg': '赠送列表获取失败'});
        }
    });
}

// 用户信息
SocketUser.userInfo = function (socket, workNo) {
    userModel.find({'workNo': workNo}, function(err, data){
        if(!err) {
            if(data.length != 0) {
                socket.emit('user.info.repley', { status: 'success', data: data[0]} );
            } else {
                socket.emit('user.info.repley', {status: 'error', data: '用户不存在'});
            }
        } else {
            socket.emit('user.info.repley', {status: 'error', data: '用户不存在'});
        }
    });
}

SocketUser.lottery = function (socket, id) {
	if(!id) {
		socket.emit('user.lottery.repley', {'msg': '抽奖失败，用户不存在.'});
	} else {
		userModel.find({_id: id}, function(err, data){
			if(!err) {
				if(data.length > 0) {
                    if(data[0].sendPeo) {
                        socket.emit('user.lottery.repley', {'msg': '你的礼物已经送给'+ data[0].sendPeo.name +'啦~', 'user': data[0]});
                        return;
                    }
                    // 理论不会出现奖池为空的情况,至少剩自己
					if(notSendPeo.length == 0) {
                        socket.emit('system.info', {'msg': '奖池为空啦，再抽一次试试~'});
					} else {
                        var rdmIdx = Math.floor(Math.random()*notSendPeo.length);
                        //var rdmIdx = parseInt((Math.random()*notSendPeo.length - 1), 10);
                        if(notRecivePeo[rdmIdx]._id.id == data[0]._id.id) {
                            if(notSendPeo.length == 1) {
                                socket.emit('system.info', {'msg': '抱歉，只剩你一个人啦~'});
                            } else {
                                async.waterfall([
                                    function (cb) {
                                        if(notRecivePeo[rdmIdx]._id.id == data[0]._id.id) {
                                            if(rdmIdx > 0) {
                                                rdmIdx = rdmIdx - 1;
                                            } else if(rdmIdx + 1 < notRecivePeo.length) {
                                                rdmIdx = rdmIdx + 1;
                                            } else {
                                                rdmIdx = Math.floor(Math.random()*notSendPeo.length);
                                            }
                                        }
                                        logger.info("随机人：" + notRecivePeo[rdmIdx] +",rdmIdx:" + rdmIdx + ", total:" + notRecivePeo.length);
                                        //for(var i=0; i< notRecivePeo.length; i++) {
                                        //    if(notRecivePeo[rdmIdx]._id.id != data[0]._id.id) {
                                        //        break;
                                        //    } else {
                                        //        rdmIdx = parseInt((Math.random()*notSendPeo.length), 10);
                                        //    }
                                        //}
                                        //while(notRecivePeo[rdmIdx]._id.id != data[0]._id.id) {
                                        //    rdmIdx = parseInt((Math.random()*notSendPeo.length), 10);
                                        //}
                                        cb(err, rdmIdx);
                                    },
                                    function (rdmIdx, cb) {
                                        lotteryHelper(socket, rdmIdx, data[0]);
                                        cb(err, null);
                                    }
                                ]);
                            }
                        } else {
                            lotteryHelper(socket, rdmIdx, data[0]);
                        }
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

    // 获取用户信息，确定没有送出礼物，并送出礼物
    userModel.findOneAndUpdate(
        {_id: userInfo._id, 'sendPeo': {$exists:false}},
        {$set: {sendPeo: notRecivePeo[rdmIdx]}}
    , function(err, result){
        logger.info("方法1：" + result);
        if(result) {
            userModel.findOneAndUpdate(
                {_id: notRecivePeo[rdmIdx]._id, 'recivePeo': {$exists:false}},
                {$set: {recivePeo: userInfo}}
            , function(err, resultRecive) {
                    logger.info("方法2" + resultRecive);
                if(resultRecive) {
                    logger.info(notRecivePeo[rdmIdx].name+ "收到[" + userInfo.name + "]的礼物" );
                    // 完成之后的处理
                    //var link = [];
                    //link.push(userInfo);
                    //link.push(notRecivePeo[rdmIdx]);
                    userInfo.sendPeo = notRecivePeo[rdmIdx];
                    socket.emit('user.lottery.reply', {'msg': '礼物送成功啦~', user: userInfo});

                    // 删除未收到礼物的缓存
                    notRecivePeo.splice(rdmIdx, 1);
                    // 删除未送礼物的缓存
                    for(var i = 0; i < notSendPeo.length; i++) {
                        if(notSendPeo[i]._id.id == userInfo._id.id) {
                            logger.info(userInfo.name +"送出礼物已删除缓存");
                            notSendPeo.splice(i, 1);
                            break;
                        }
                    }
                    logger.info("当前未收到礼物的还有:" + notRecivePeo.length);
                    logger.info("当前未送出礼物的还有:" + notSendPeo.length);
                    // 广播
                    socket.broadcast.emit('user.lottery.new', userInfo);
                } else {
                    // 取消送出的礼物
                    logger.info("回滚：" + result.name + " -> " + resultRecive.name + "的礼物");
                    userModel.update({_id: userInfo._id}, {"$unset": {"sendPeo": 1}}, {}, function (error) {
                        socket.emit('system.info', { 'msg' : "姿势不对？再来一次吧~"});
                    });
                }
            });
        } else {
            socket.emit('system.info', { 'msg' : "你已经送过礼物啦~"});
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
    userModel.find({'sendPeo': {$exists:false}}, function (err, list) {
        if(!err) {
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
    userModel.find({'recivePeo': {$exists:false}}, function (err, list) {
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