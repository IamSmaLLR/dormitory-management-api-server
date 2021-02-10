var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建楼栋信息
 * 
 * @param  {[type]}   obj 楼栋信息
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("BuildingModel",obj,cb);
}

/**
 * 获取楼栋列表
 * 
 * @param  {Function} cb         回调函数
 */
module.exports.list = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM building";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb('获取楼栋列表失败', null);
		cb(null,result);
	})
}

/**
 * 通过查询条件获取楼栋对象
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function(conditions,cb) {
	daoModule.findOne("BuildingModel",conditions,cb);
}

/**
 * 通过关键词查询楼栋信息
 * 
 * @param  {[type]}   key    关键词
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM building";

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
 * 判断是否存在楼栋
 * 
 * @param  {[type]}   buildingId   楼栋号
 * @param  {Function} cb       回调函数
 * 
 */
module.exports.exists = function(buildingId,cb) {
	var db = databaseModule.getDatabase();
	var Model = db.models.BuildingModel;
	Model.exists({"buildingId":buildingId},function(err,isExists){
		if(err) return cb("查询失败");
		 cb(null,isExists);
	});
}

/**
 * 模糊查询楼栋数量
 * 
 * @param  {[type]}   key 关键词
 * @param  {Function} cb  回调函数
 */
module.exports.countByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM building";
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
 * 通过ID获取楼栋对象数据
 * 
 * @param  {[type]}   id 楼栋主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.show = function(id,cb) {
	daoModule.show("BuildingModel",id,cb);
}

/**
 * 更新楼栋信息
 * 
 * @param  {[type]}   obj 楼栋对象
 * @param  {Function} cb  回调函数
 */
module.exports.update = function(obj,cb) {
	daoModule.update("BuildingModel",obj.buildingId,obj,cb);
}

/**
 * 删除学生用户对象数据
 * 
 * @param  {[type]}   id 主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.destroy = function(id,cb) {
	daoModule.destroy("BuildingModel",id,function(err){
		if(err) return cb(err);
		return cb(null);
	});
}

/**
 * 保存楼栋信息
 * 
 * @param  {[type]}   obj 楼栋对象
 * @param  {Function} cb  回调函数
 */
module.exports.save = function(obj,cb) {
	daoModule.show(obj.buildingId,function(err,oldObj){
		if(err) {
			daoModule.create("BuildingModel",obj,cb);
		} else {
			daoModule.update("BuildingModel",obj.buildingId,obj,cb);
		}
	})
}

/**
 * 获取楼栋数量
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.count = function(cb) {
	daoModule("BuildingModel",cb);
}