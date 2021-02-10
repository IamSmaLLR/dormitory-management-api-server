var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var DmtyManageDAO = require(path.join(process.cwd(),"dao/DormitoryManageDAO"));
var PowerManageDAO = require(path.join(process.cwd(),"dao/PowerManageDAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));
var _ = require('lodash');

/**
 * 查询宿舍电费
 * @param  {[type]}   buildingId 楼栋号
 * @param  {[type]}   roomId     宿舍号
 * @param  {Function} cb 		 回调函数
 */
module.exports.getDmtyBalance = function(buildingId,roomId,cb){
	DmtyManageDAO.findOne({"buildingId":buildingId,"roomId":roomId},function(err,result){
		if(err || !result) return cb('查无此宿舍')
		cb(null,{
			"buildingId":result.buildingId,
			"roomId":result.roomId,
			"accountBalance":result.accountBalance
		})
	})
}

/**
 * 创建订单
 * 
 * @param  {[type]}   payOrder  缴费订单
 * @param  {Function} cb        回调函数
 */
module.exports.createOrder = function(userInfo,payOrder,cb) {
	userid = userInfo.uid
	UserManageDAO.findOne({"userid":userid},function(err,result){
		PowerManageDAO.create({
			"userid":result.userid,
			"username":result.username,
			"buildingId":payOrder.buildingId,
			"roomId":payOrder.roomId,
			"payDate":(new Date().getTime()),
			"payBalance":payOrder.payBalance,
			"orderState":1,
			"payMethod":payOrder.payMethod
		},function(err,result){
			if(err) return cb("添加缴费订单失败~");
			cb(null,"添加缴费订单成功！");
		});
	})
}

/**
 * 查询缴费订单
 * 
 * @param  {Function} cb        回调函数
 */
module.exports.getOrderList = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	// 通过关键词获取学生数量
	PowerManageDAO.countByKey(conditions["query"],function(err,count) {
		var key = conditions["query"];
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		PowerManageDAO.findByKey(key,offset,limit,function(err,result){
			var orderList = []
			for(idx in result){
				var order = result[idx]
				orderList.push({
					"id":order.id,
					"userid":order.userid,
					"username":order.username,
					"buildingId":order.buildingId,
					"roomId":order.roomId,
					"payBalance":order.payBalance,
					"payDate":order.payDate,
					"orderState":order.orderState
				})
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["orders"] = orderList;
			cb(err,resultData);
		});
	});
}

/**
 * 电费订单状态更新
 *
 * @param  {[type]}   id  		 订单id
 * @param  {[type]}   buildingId 楼栋号
 * @param  {[type]}   roomId     宿舍号
 * @param  {[type]}   payBalance 缴费金额
 * @param  {[type]}   orderState 订单状态
 * @param  {Function} cb         回调函数
 */
module.exports.updateOrderState = function(id,buildingId,roomId,payBalance,orderState,cb) {
	if(orderState == 3) {
		PowerManageDAO.updateState({"id":id,"orderState":orderState},function(err,result){
			if(err) return cb("更新电费订单状态失败");
			cb(null,"取消电费订单成功");
		})
	} else if(orderState == 2){
		DmtyManageDAO.findOne({"buildingId":buildingId,"roomId":roomId},function(err,result){
			PowerManageDAO.updateBalance({"id":result.id,"accountBalance":result.accountBalance+payBalance},function(err,result){
				if(err) return cb("更新宿舍电费余额失败");
				PowerManageDAO.updateState({"id":id,"orderState":orderState},function(err,result) {
					if(err) return cb("更新电费订单状态失败");
					cb(null,"更新电费订单状态成功");
				});
			})
		})
	}
}


/**
 * 获取所有宿舍电费信息
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"query" : 关键词查询,
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param  {Function} cb         回调函数
 */
module.exports.getAllDormitoryPower = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");

	DmtyManageDAO.countByKey(conditions["query"],function(err,count) {
		key = conditions["query"];
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);

		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		DmtyManageDAO.findByKey(key,offset,limit,function(err,result){
			var Dormitories = {};
			// 处理楼栋信息
			for(idx in result) {
				var dormitory = result[idx];
				if(!Dormitories[dormitory.buildingId]){
					Dormitories[dormitory.buildingId] = {
						"id":dormitory.id,
						"dmtyId":dormitory.buildingId,
						"identify":1,
						"accountBalance":'',
						"children":[]
					};
				}
			}
			// 处理宿舍信息
			for(idx in result) {
				var dormitory = result[idx];
				building = Dormitories[dormitory.buildingId]
				if(building){
					building.children.push({
						"id":dormitory.id,
						"dmtyId":dormitory.buildingId+'#'+dormitory.roomId,
						"identify":2,
						"accountBalance":dormitory.accountBalance
					});
				}
			}
			// 创建 object 自身可枚举属性的值为数组。
			Result = _.values(Dormitories);
			// 排序
			Result = _.sortBy(Result,"id");
			for(idx in Result) {
				subresult = Result[idx];
				subresult.children = _.sortBy(subresult.children,"dmtyId".split('#')[1]);
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["dormitory"] = Result;
			cb(err,resultData);
		});
	});
}


/**
 * 手动缴费
 *
 * @param  {[type]}   obj  		 宿舍信息对象
 * @param  {Function} cb         回调函数
 */
module.exports.updateBalance = function(obj,cb) {
	DmtyManageDAO.findOne({"id":obj.id},function(err,result){
		PowerManageDAO.updateBalance({"id":result.id,"accountBalance":result.accountBalance+obj.payBalance},function(err,result){
			if(err) return cb("手动缴费失败");
			cb(null,"手动缴费成功");
		})
	})
}


/**
 * 查看宿舍订单
 *
 * @param  {[type]}   id  	宿舍id
 * @param  {Function} cb    回调函数
 */
module.exports.showPaylist = function(id,cb) {
	DmtyManageDAO.findOne({"id":id},function(err,result){
		PowerManageDAO.payPowerList({"buildingId":result.buildingId,"roomId":result.roomId},function(err,result){
			var orderlist = []
			for(idx in result){
				var order = result[idx]
				orderlist.push({
					"payDate":order.payDate,
					"dmtyId":order.buildingId + '#' +order.roomId,
					"user":order.userid+order.username,
					"payBalance":order.payBalance,
					"orderState":order.orderState
				})
			}
			if(err) return cb("手动缴费失败");
			cb(null,orderlist);
		})
	})
}