var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 获取未分配宿舍学生数据
 * 
 * @param  {Function} cb     回调函数
 */
module.exports.list = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM users WHERE state = 0 AND isAdmin = 0";
	database.driver.execQuery(sql,function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
}

/* 通过关键词对象查询未分配学生用户
 * 
 * @param  {[type]}   obj    关键词对象
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByObj = function(obj,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM users WHERE state = 0 AND isAdmin = 0";
	key = [];
	if(obj.id){
		sql += " AND userid LIKE ?";
		id = "%" + obj.id + "%"
		key.push(id);
	}
	if(obj.sex && obj.sex !== '0'){
		sql += " AND sex = ?";
		key.push(obj.sex);
	}
	sql += " LIMIT ?,?";
	key.push(offset,limit)
	database.driver.execQuery(sql,key,function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result);
	})
}

/**
 * 判断是否存在未分配宿舍学生
 * 
 * @param  {[type]}   userid   学生学号
 * @param  {Function} cb       回调函数
 * 
 */
module.exports.exists = function(userid,cb) {
	var db = databaseModule.getDatabase();
	var Model = db.models.UsersModel;
	Model.exists({"userid":userid, "state":0, "isAdmin":0},function(err,isExists){
		if(err) return cb("查询失败");
		 cb(null,isExists);
	});
}

/**
 * 关键词对象模糊查询未分配学生用户数量
 * 
 * @param  {[type]}   obj 关键词对象
 * @param  {Function} cb  回调函数
 */
module.exports.countByObj = function(obj,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM users WHERE state = 0 AND isAdmin = 0";
	key = [];
	if(obj.id){
		sql += " AND userid LIKE ?";
		id = "%" + obj.id + "%";
		key.push(id);
	}
	if(obj.sex && obj.sex !== '0'){
		sql += " AND sex = ?";
		key.push(obj.sex);
	}
	database.driver.execQuery(sql,key,function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result[0]["count"]);
	})
}

/**
 * 通过查询条件获取楼栋宿舍对象
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function(conditions,cb) {
	daoModule.findOne("DormitoryModel",conditions,cb);
}

module.exports.findIdentify = function(conditions,cb) {
	daoModule.findOne("BuildingModel",conditions,cb);
}

/**
 * 更新学生分配宿舍信息
 * 
 * @param  {[type]}   obj 宿舍对象
 * @param  {Function} cb  回调函数
 */
module.exports.update = function(obj,cb) {
	db = databaseModule.getDatabase();
	sql = "UPDATE users as u, dormitory as d SET u.buildingId = d.buildingId, u.roomId = d.roomId, u.state = 1, d.idleCapacity = ?, d.members = ? where d.buildingId = ? AND d.roomId = ? AND u.userid = ?";
	database.driver.execQuery(sql,[obj.idleCapacity,obj.members,obj.buildingId,obj.roomId,obj.userid],function(err,result){
			if(err) return cb("更新执行出错");
			cb(null,result);
	});
}

/**
 * 获取未分配学生数数量
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.count = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM users WHERE state = 0 AND isAdmin = 0";
	database.driver.execQuery(sql,function(err,result){
				if(err) return cb("查询执行出错");
				cb(null,result);
			});
}

/**
 * 通过ID获取审批订单对象数据
 * 
 * @param  {[type]}   id 申请主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.show = function(id,cb) {
	daoModule.show("AdjustModel",id,cb);
}