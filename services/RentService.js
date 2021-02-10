var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var RentManageDAO = require(path.join(process.cwd(),"dao/RentManageDAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));

/**
 * 获取所有租赁物品列表
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

module.exports.getAllGoodsList = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	RentManageDAO.allCountByKey(conditions["query"],function(err,count) {
		var key = conditions["query"]
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		RentManageDAO.allFindByKey(key,offset,limit,function(err,result){
			var goodsList = []
			for(idx in result){
				goods = result[idx]
				goodsList.push({
					"id":goods.id,
					"goods_name":goods.goods_name,
					"goods_price":goods.goods_price,
					"goods_number":goods.goods_number,
					"goods_state":goods.goods_state == 1? true:false,
					"goods_picture":goods.goods_picture,
					"goods_desc":goods.goods_desc
				})
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["goods"] = goodsList;
			cb(err,resultData);
		});
	});
}

/**
 * 获取可租赁物品列表
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

module.exports.getGoodsList = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	RentManageDAO.countByKey(conditions["query"],function(err,count) {
		var key = conditions["query"]
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		RentManageDAO.findByKey(key,offset,limit,function(err,result){
			var goodsList = []
			for(idx in result){
				goods = result[idx]
				goodsList.push({
					"id":goods.id,
					"goods_name":goods.goods_name,
					"goods_price":goods.goods_price,
					"goods_number":goods.goods_number,
					"goods_state":goods.goods_state == 1? true:false,
					"goods_picture":goods.goods_picture,
					"goods_desc":goods.goods_desc
				})
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["goods"] = goodsList;
			cb(err,resultData);
		});
	});
}


/**
 * 获取租赁订单列表
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

module.exports.getRentList = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	RentManageDAO.countByState(conditions["query"],function(err,count) {
		var key = conditions["query"]
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		RentManageDAO.findByState(key,offset,limit,function(err,result){
			var rentList = []
			for(idx in result){
				rent = result[idx]
				rentList.push({
					"id":rent.id,
					"userid":rent.userid,
					"username":rent.username,
					"goods_name":rent.goods_name,
					"goods_id":rent.goods_id,
					"rent_time":rent.rent_time,
					"goods_price":rent.goods_price,
					"submitDate":rent.submitDate,
					"approvalState":rent.approvalState,
					"approvalDate":rent.approvalDate
				})
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["rent"] = rentList;
			cb(err,resultData);
		});
	});
}


/**
 * 获取学生提交的租赁申请
 * 
 * @param   {[type]}   userInfo 学生信息
 * @param   {Function} cb       回调函数
 */

module.exports.getSubmitList = function(userInfo,cb) {	
	if(!userInfo) return cb("无权限访问");
	userid = userInfo.uid;
	RentManageDAO.getApprovalList(userid,function(err,result) {
		if(err || !result) return cb("您没有租赁物品申请");
		var rentList = []
		for(idx in result){
			item = result[idx]
			rentList.push({
				"userid":item.userid,
				"username":item.username,
				"goods_name":item.goods_name,
				"goods_id":item.goods_id,
				"rent_time":item.rent_time,
				"goods_price":item.goods_price,
				"submitDate":item.submitDate,
				"approvalDate":item.approvalDate,
				"approvalState":item.approvalState
			})
		}
		cb(null,rentList);
	})
}

/**
 * 创建物品租赁申请单
 * 
 * @param  {[type]}   submit  提交内容
 * @param  {Function} cb      回调函数
 */
module.exports.createSubmit = function(userInfo,submit,cb) {
	if(!userInfo) return cb("无权限访问");
	userid = userInfo.uid;
	UserManageDAO.findOne({"userid":userid},function(err,result){
		RentManageDAO.createRentList({
			"userid":userid,
			"username":result.username,
			"goods_name":submit.goods_name,
			"goods_id":submit.goods_id,
			"rent_time":submit.rent_time,
			"goods_price":submit.goods_price,
			"submitDate":(new Date().getTime()),
			"approvalState":1
		},function(err,result){
			if(err) return cb("物品租赁申请失败~");
			cb(null,"物品租赁申请成功");
		})
	})
}

/**
 * 创建物品
 * 
 * @param  {[type]}   goods   物品信息
 * @param  {Function} cb      回调函数
 */
module.exports.createGoods = function(goods,cb) {
	RentManageDAO.createGoods({
		"goods_name":goods.goods_name,
		"goods_price":goods.goods_price,
		"goods_number":goods.goods_number,
		"goods_state":1,
		"goods_picture":goods.goods_picture,
		"goods_desc":goods.goods_desc
	},function(err,result){
		if(err) return cb("物品信息创建失败~");
		cb(null,"物品信息创建成功");
	})
}

/**
 * 更改租赁物品是否开放租赁状态
 *
 * @param  {[type]}   state  租赁状态
 * @param  {Function} cb     回调函数
 */
module.exports.updateState = function(id,state,cb) {
	RentManageDAO.findGoodsOne({"id":id},function(err,result){
		if(state == 1 && result.goods_number == 0) return cb("租赁物品库存为0，请先补充！")
		RentManageDAO.updateGoods({"id":id,"goods_state":state},function(error,res) {
			if(error) return cb("更新租赁物品状态失败");
			cb(null,"更新租赁物品状态成功");
		});
	})
}

/**
 * 获取租赁物品信息数据
 * 
 * @param   {Object}   id    租赁物品id
 * @param   {Function} cb    回调函数
 */

module.exports.getGoodsInfo = function(id,cb) {	
	RentManageDAO.showGoods(id,function(err,result) {
		if(err || !result) return cb("物品不存在");
		cb(null,{"goods_name":result.goods_name,"goods_price":result.goods_price,"goods_number":result.goods_number});
	})
}

/**
 * 更改租赁物品信息
 *
 * @param  {[type]}   obj    租赁物品信息
 * @param  {Function} cb     回调函数
 */
module.exports.updateGoodsInfo = function(obj,cb) {
	RentManageDAO.updateGoods({
		"id":obj.id,
		"goods_name":obj.goods_name,
		"goods_price":obj.goods_price,
		"goods_number":obj.goods_number,
		},function(error,res) {
		if(error) return cb("更新租赁物品状态失败");
		cb(null,"更新租赁物品状态成功");
	});
}

/**
 * 通过租赁物品 ID 进行删除操作
 * 
 * @param  {[type]}   id 物品ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteGoods = function(id,cb) {
	RentManageDAO.destroy(id,function(err,result){
		if(err) return cb("删除租赁物品信息失败");
		cb(null,"删除租赁物品信息成功");
	})
}

/**
 * 租赁订单审批
 *
 * @param  {[type]}   id  	     订单列表id
 * @param  {[type]}   state  	 租赁订单状态
 * @param  {Function} cb         回调函数
 */
module.exports.updateRentListState = function(id,state,cb) {
	if(state == 3) {
		RentManageDAO.updateState({"id":id,"approvalState":state,"approvalDate":(new Date().getTime())},function(err,result){
			if(err) return cb("更新租赁订单状态失败");
			cb(null,"驳回租赁订单成功");
		})
	} else if(state == 4) {
		RentManageDAO.updateState({"id":id,"approvalState":state},function(err,result){
			if(err) return cb("更新租赁订单状态失败");
			cb(null,"租赁订单已完成");
		})
	} else if(state == 2){
		RentManageDAO.findRentListOne({"id":id},function(err,result){
			RentManageDAO.findGoodsOne({"id":result.goods_id},function(err,result){
				if(result.goods_number == 0) return cb("该商品已无库存")
				RentManageDAO.updateGoods({
					"id":result.id,
					"goods_number":result.goods_number - 1,
					"goods_state":result.goods_number == 1? 0:result.goods_state
				},function(err,result){
					RentManageDAO.updateState({"id":id,"approvalState":state,"approvalDate":(new Date().getTime())},function(err,result){
						if(err) return cb("更新租赁订单状态失败");
						cb(null,"租赁订单审批通过，等待缴费");
					})
				})
			})
		})
	}
}