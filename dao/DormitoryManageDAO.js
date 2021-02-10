var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建宿舍信息
 * 
 * @param  {[type]}   obj 宿舍信息
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("DormitoryModel",obj,cb);
}

/**
 * 获取宿舍列表
 * 
 * @param  {Function} cb         回调函数
 */
module.exports.list = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM dormitory";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb('获取宿舍列表失败', null);
		cb(null,result);
	})
}

/**
 * 获取某楼栋宿舍列表
 * 
 * @param  {Function} cb         回调函数
 */
module.exports.listDmty = function(buildingId,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM dormitory WHERE buildingId = ?";
	database.driver.execQuery(sql,[buildingId],function(err,result){
		if(err) return cb('获取宿舍列表失败', null);
		cb(null,result);
	})
}

/**
 * 通过查询条件获取宿舍对象
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function(conditions,cb) {
	daoModule.findOne("DormitoryModel",conditions,cb);
}

/**
 * 通过关键词查询楼栋宿舍信息
 * 
 * @param  {[type]}   key    关键词
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM dormitory";

	if(key) {
		sql += " WHERE buildingId LIKE ? LIMIT ?,?";
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
 * 判断是否存在宿舍
 * 
 * @param  {[type]}   obj      楼栋宿舍对象
 * @param  {Function} cb       回调函数
 * 
 */
module.exports.exists = function(obj,cb) {
	var db = databaseModule.getDatabase();
	var Model = db.models.DormitoryModel;
	Model.exists({"buildingId":obj.buildingId, "roomId":obj.roomId},function(err,isExists){
		if(err) return cb("查询失败");
		 cb(null,isExists);
	});
}

/**
 * 模糊查询楼栋宿舍数量
 * 
 * @param  {[type]}   key 关键词
 * @param  {Function} cb  回调函数
 */
module.exports.countByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM dormitory";
	if(key) {
		sql += " WHERE buildingId LIKE ?";
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
 * 通过ID获取宿舍对象数据
 * 
 * @param  {[type]}   id 宿舍主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.show = function(id,cb) {
	daoModule.show("DormitoryModel",id,cb);
}

/**
 * 更新宿舍信息
 * 
 * @param  {[type]}   obj 宿舍对象
 * @param  {Function} cb  回调函数
 */
module.exports.update = function(obj,cb) {
	daoModule.update("DormitoryModel",obj.id,obj,cb);
}

/**
 * 删除学生用户对象数据
 * 
 * @param  {[type]}   id 主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.destroy = function(id,cb) {
	daoModule.destroy("DormitoryModel",id,function(err){
		if(err) return cb(err);
		return cb(null);
	});
}

/**
 * 保存宿舍信息
 * 
 * @param  {[type]}   obj 宿舍对象
 * @param  {Function} cb  回调函数
 */
module.exports.save = function(obj,cb) {
	daoModule.show(obj.id,function(err,oldObj){
		if(err) {
			daoModule.create("DormitoryModel",obj,cb);
		} else {
			daoModule.update("DormitoryModel",obj.id,obj,cb);
		}
	})
}

/**
 * 获取宿舍数量
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.count = function(cb) {
	daoModule("DormitoryModel",cb);
}