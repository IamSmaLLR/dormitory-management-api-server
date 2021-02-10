var path = require('path');
daoModule = require('./DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));
var Password = require("node-php-password");
/**
 * 创建学生用户
 * 
 * @param  {[type]}   obj 用户信息
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("UsersModel",obj,cb);
}

/**
 * 获取学生用户列表
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb         回调函数
 */
module.exports.list = function(conditions,cb) {
	daoModule.list("UsersModel",conditions,function(err,models) {
		if(err) return cb(err,null);
		cb(null,models);
	});
}

/**
 * 通过查询条件获取学生用户对象
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function(conditions,cb) {
	daoModule.findOne("UsersModel",conditions,cb);
}


/* 通过关键词查询学生用户
 * 
 * @param  {[type]}   key    关键词
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM users";

	if(key) {
		sql += " WHERE userid LIKE ? AND isAdmin = 0 LIMIT ?,? ";
		database.driver.execQuery(
			sql
		,["%" + key + "%",offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
	} else {
		sql += " WHERE isAdmin = 0 LIMIT ?,? ";
		database.driver.execQuery(sql,[offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
	}
}

/* 通过关键词对象查询学生用户
 * 
 * @param  {[type]}   obj    关键词对象
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByObj = function(obj,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM users WHERE isAdmin = 0";
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
	if(obj.buildingId){
		sql += " AND buildingId = ?";
		key.push(obj.buildingId);
	}
	if(obj.roomId){
		sql += " AND roomId = ?";
		key.push(obj.roomId);
	}
	if(obj.state && obj.state !== 'all'){
		sql += " AND state = ?";
		key.push(obj.state);
	}
	sql += " LIMIT ?,?";
	key.push(offset,limit)
	database.driver.execQuery(sql,key,function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result);
	})
}


/**
 * 判断是否存在学生用户
 * 
 * @param  {[type]}   userid   用户名
 * @param  {Function} cb       回调函数
 * 
 */
module.exports.exists = function(userid,cb) {
	var db = databaseModule.getDatabase();
	var Model = db.models.UsersModel;
	Model.exists({"userid":userid},function(err,isExists){
		if(err) return cb("查询失败");
		cb(null,isExists);
	});
}


/**
 * 模糊查询学生用户数量
 * 
 * @param  {[type]}   key 关键词
 * @param  {Function} cb  回调函数
 */
module.exports.countByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM users";
	if(key) {
		sql += " WHERE userid LIKE ? AND isAdmin = 0";
		database.driver.execQuery(
			sql
		,["%" + key + "%"],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	} else {
		sql += " WHERE isAdmin = 0";
		database.driver.execQuery(sql,function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	}
}

/**
 * 关键词对象模糊查询学生用户数量
 * 
 * @param  {[type]}   obj 关键词对象
 * @param  {Function} cb  回调函数
 */
module.exports.countByObj = function(obj,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM users WHERE isAdmin = 0";
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
	if(obj.buildingId){
		sql += " AND buildingId = ?";
		key.push(obj.buildingId);
	}
	if(obj.roomId){
		sql += " AND roomId = ?";
		key.push(obj.roomId);
	}
	if(obj.state && obj.state !== 'all'){
		sql += " AND state = ?";
		key.push(obj.state);
	}
	database.driver.execQuery(sql,key,function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result[0]["count"]);
	})
}

/**
 * 通过ID获取学生用户对象数据
 * 
 * @param  {[type]}   id 用户主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.show = function(id,cb) {
	daoModule.show("UsersModel",id,cb);
}

/**
 * 更新学生用户信息
 * 
 * @param  {[type]}   obj 用户对象
 * @param  {Function} cb  回调函数
 */
module.exports.update = function(obj,cb) {
	daoModule.update("UsersModel",obj.userid,obj,cb);
}

/**
 * 删除学生用户对象数据
 * 
 * @param  {[type]}   id 主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.destroy = function(id,cb) {
	daoModule.destroy("UsersModel",id,function(err){
		if(err) return cb(err);
		return cb(null);
	});
}

/**
 * 保存学生用户信息
 * 
 * @param  {[type]}   obj 用户对象
 * @param  {Function} cb  回调函数
 */
module.exports.save = function(obj,cb) {
	daoModule.show(obj.userid,function(err,oldObj){
		if(err) {
			daoModule.create("UsersModel",obj,cb);
		} else {
			daoModule.update("UsersModel",obj.userid,obj,cb);
		}
	})
}

/**
 * 获取学生用户数量
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.count = function(cb) {
	daoModule.count("UsersModel",cb);
}

/**
 * 获取学生男女数量比例
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.countBySex = function(sex,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM users WHERE sex = ? AND isAdmin = 0";
	database.driver.execQuery(sql,[sex],function(err,result){
		if(err) return cb("查询执行出错"); 
		cb(null,result[0]["count"]);
	});
}

// 查询未分配学生数量
module.exports.countAssign = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM users WHERE state = 0 AND isAdmin = 0";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb("查询执行出错"); 
		cb(null,result[0]["count"]);
	});
}

// 查询未调整的学生数量
module.exports.countAdjust = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM adjustlist WHERE approvalState = 1 or approvalState = 2";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb("查询执行出错"); 
		cb(null,result[0]["count"]);
	});
}

// 查询未处理的维修单的数量
module.exports.countRepair = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM repairlist WHERE approvalState = 1 or approvalState = 2";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb("查询执行出错"); 
		cb(null,result[0]["count"]);
	});
}


// 查询未处理的电费缴费单的数量
module.exports.countPay = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM paylist WHERE orderState = 1";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb("查询执行出错"); 
		cb(null,result[0]["count"]);
	});
}

// 查询未处理的租赁订单的数量
module.exports.countRent = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM rentlist WHERE approvalState = 1 or approvalState = 2";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb("查询执行出错"); 
		cb(null,result[0]["count"]);
	});
}