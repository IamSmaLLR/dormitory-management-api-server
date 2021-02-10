var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建维修申请单
 * 
 * @param  {[type]}   obj 维修申请单对象
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("RepairModel",obj,cb);
}

/**
 * 获取报修申请列表数据
 * 
 * @param  {[type]}   userid 查看报修申请单的用户学号
 * @param  {Function} cb     回调函数
 */
module.exports.listSubmit = function(userid,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * from repairlist WHERE userid = ?";
	database.driver.execQuery(sql,[userid],function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result);
	});
}

/**
 * 通过关键词查询维修申请
 * 
 * @param  {[type]}   key    关键词
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByState = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM repairlist";

	if(key && key!=='0') {
		sql += " WHERE approvalState = ? LIMIT ?,?";
		database.driver.execQuery(
			sql
		,[key,offset,limit],function(err,managers){
			if(err) return cb("查询执行出错");
			cb(null,managers);
		});
	} else {
		sql += " LIMIT ?,? ";
		database.driver.execQuery(sql,[offset,limit],function(err,managers){
			if(err) return cb("查询执行出错");
			cb(null,managers);
		});
	}
}

/**
 * 模糊查询维修申请数量
 * 
 * @param  {[type]}   key 关键词
 * @param  {Function} cb  回调函数
 */
module.exports.countByState = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM repairlist";
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
 * 通过学生学号获取维修申请对象数据
 * 
 * @param  {[type]}   id 用户主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.show = function(id,cb) {
	daoModule.show("RepairModel",id,cb);
}

/**
 * 更新申请审批状态
 * 
 * @param  {[type]}   obj 修改对象
 * @param  {Function} cb  回调函数
 */
module.exports.updateState = function(obj,cb) {
	daoModule.update("RepairModel",obj.id,obj,cb);
}

/**
 * 获取维修申请订单数量
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.count = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM repairlist";
	database.driver.execQuery(sql,function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
}
