var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建租赁物品
 * 
 * @param  {[type]}   obj 物品信息
 * @param  {Function} cb  回调函数
 */
module.exports.createGoods = function(obj,cb) {
	daoModule.create("GoodsModel",obj,cb);
}

/**
 * 创建租赁申请单
 * 
 * @param  {[type]}   obj 物品信息
 * @param  {Function} cb  回调函数
 */
module.exports.createRentList = function(obj,cb) {
	daoModule.create("RentModel",obj,cb);
}

/**
 * 通过查询条件获取租赁物品
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findGoodsOne = function(conditions,cb) {
	daoModule.findOne("GoodsModel",conditions,cb);
}

module.exports.findRentListOne = function(conditions,cb) {
	daoModule.findOne("RentModel",conditions,cb);
}

/**
 * 获取物品租赁列表
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb         回调函数
 */
module.exports.getGoodsList = function(conditions,cb) {
	daoModule.list("GoodsModel",conditions,function(err,models) {
		if(err) return cb(err,null);
		cb(null,models);
	});
}

/**
 * 获取物品租赁申请单列表
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb         回调函数
 */
module.exports.getApprovalList = function(userid,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM rentlist WHERE userid = ?";
	database.driver.execQuery(sql,[userid],function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result);
	});
}

/**
 * 通过关键词查询物品信息
 * 
 * @param  {[type]}   key    关键词
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM goodslist WHERE goods_state = 1";

	if(key) {
		sql += " AND goods_name LIKE ? LIMIT ?,?";
		database.driver.execQuery(
			sql
		,["%" + key + "%",offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
	} else {
		sql += " LIMIT ?,? ";
		database.driver.execQuery(sql,[offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
	}
}

module.exports.allFindByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM goodslist";

	if(key) {
		sql += " WHERE goods_name LIKE ? LIMIT ?,?";
		database.driver.execQuery(
			sql
		,["%" + key + "%",offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
	} else {
		sql += " LIMIT ?,? ";
		database.driver.execQuery(sql,[offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
	}
}

/**
 * 通过关键词审批状态查询租赁申请单
 * 
 * @param  {[type]}   key    关键词
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByState = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM rentlist";

	if(key && key!=='0') {
		sql += " WHERE approvalstate = ? LIMIT ?,?";
		database.driver.execQuery(
			sql
		,[key,offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
	} else {
		sql += " LIMIT ?,? ";
		database.driver.execQuery(sql,[offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
	}
}

/**
 * 模糊查询租赁物品数量
 * 
 * @param  {[type]}   key 关键词
 * @param  {Function} cb  回调函数
 */
module.exports.countByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM goodslist WHERE goods_state = 1";
	if(key) {
		sql += " AND goods_name LIKE ?";
		database.driver.execQuery(
			sql
		,["%" + key + "%"],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	} else {
		database.driver.execQuery(sql,function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	}
}

module.exports.allCountByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM goodslist";
	if(key) {
		sql += " WHERE goods_name LIKE ?";
		database.driver.execQuery(
			sql
		,["%" + key + "%"],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	} else {
		database.driver.execQuery(sql,function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	}
}

/**
 * 模糊查询租赁申请单数量
 * 
 * @param  {[type]}   key 关键词
 * @param  {Function} cb  回调函数
 */
module.exports.countByState = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM rentlist";
	if(key && key!=='0') {
		sql += " WHERE approvalState = ?";
		database.driver.execQuery(
			sql
		,[key],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	} else {
		database.driver.execQuery(sql,function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	}
}

/**
 * 通过ID获取租赁物品对象数据
 * 
 * @param  {[type]}   id 物品主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.showGoods = function(id,cb) {
	daoModule.show("GoodsModel",id,cb);
}

/**
 * 通过ID获取租赁申请单对象数据
 * 
 * @param  {[type]}   id 用户主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.showApproval = function(userid,cb) {
	daoModule.show("RentModel",userid,cb);
}

/**
 * 更新租赁物品信息
 * 
 * @param  {[type]}   obj 租赁物品对象
 * @param  {Function} cb  回调函数
 */
module.exports.updateGoods = function(obj,cb) {
	daoModule.update("GoodsModel",obj.id,obj,cb);
}

/**
 * 更新租赁物品状态信息
 * 
 * @param  {[type]}   obj 审批状态对象
 * @param  {Function} cb  回调函数
 */
module.exports.updateState = function(obj,cb) {
	daoModule.update("RentModel",obj.id,obj,cb);
}

/**
 * 删除租赁物品对象数据
 * 
 * @param  {[type]}   id 主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.destroy = function(id,cb) {
	daoModule.destroy("GoodsModel",id,function(err){
		if(err) return cb(err);
		return cb(null);
	});
}
