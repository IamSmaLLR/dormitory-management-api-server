var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建缴费订单
 * 
 * @param  {[type]}   obj 物品信息
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("PayModel",obj,cb);
}

/**
 * 获取楼栋电费列表
 * @param  {[type]}   obj   楼栋宿舍对象
 * @param  {Function} cb    回调函数
 */
module.exports.payPowerList = function(obj,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM paylist WHERE buildingId = ? AND roomId = ?";
	database.driver.execQuery(sql,[obj.buildingId,obj.roomId],function(err,result){
		if(err) return cb('获取宿舍订单列表失败', null);
		cb(null,result);
	})
}

/**
 * 通过关键词学号查询缴费订单
 * 
 * @param  {[type]}   key    关键词
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */

module.exports.findByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM paylist";

	if(key) {
		sql += " WHERE userid LIKE ? LIMIT ?,?";
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
 * 模糊查询缴费订单数量
 * 
 * @param  {[type]}   key 关键词
 * @param  {Function} cb  回调函数
 */
module.exports.countByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM paylist";
	if(key) {
		sql += " WHERE userid LIKE ? LIMIT ?,?";
		database.driver.execQuery(
			sql
		,["%" + key + "%",offset,limit],function(err,result){
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
 * 通过ID获取宿舍缴费订单对象数据
 * 
 * @param  {[type]}   id 楼栋宿舍主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.showPaylist = function(id,cb) {
	daoModule.show("PayModel",id,cb);
}

/**
 * 手动缴费
 * 
 * @param  {[type]}   obj 缴费对象
 * @param  {Function} cb  回调函数
 */
module.exports.updateBalance = function(obj,cb) {
	daoModule.update("DormitoryModel",obj.id,obj,cb);
}

/**
 * 改变订单状态
 * 
 * @param  {[type]}   obj 缴费对象
 * @param  {Function} cb  回调函数
 */
module.exports.updateState = function(obj,cb) {
	daoModule.update("PayModel",obj.id,obj,cb);
}