var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建调整申请
 * 
 * @param  {[type]}   obj 申请信息
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("AdjustModel",obj,cb);
}

/**
 * 获取申请调整学生数据
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb     回调函数
 */
module.exports.listApproval = function(conditions,cb) {
	daoModule.list("AdjustModel",conditions,function(err,models) {
		if(err) return cb(err,null);
		cb(null,models);
	});
}

/**
 * 获取申请调整学生数据
 * 
 * @param  {[type]}   userid 查看申请单的用户学号
 * @param  {Function} cb     回调函数
 */
module.exports.listSubmit = function(userid,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT a.submitDate, a.userid, u.username, u.sex, a.buildingId, a.roomId, a.approvalState, a.approvalDate FROM users as u, adjustlist as a WHERE a.userid = ? AND u.userid = a.userid";
	database.driver.execQuery(
			sql
		,[userid],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		});
}

/**
 * 通过查询条件获取申请列表对象
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function(conditions,cb) {
	daoModule.findOne("AdjustModel",conditions,cb);
}

/* 通过关键词对象查询申请调整宿舍审批通过学生用户
 * 
 * @param  {[type]}   obj    关键词对象
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.findByObj = function(obj,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT a.id, a.userid, u.username, u.sex, u.buildingId, u.roomId, u.collegeMajor FROM users as u, adjustlist as a WHERE u.userid = a.userid AND a.approvalState = 2";
	key = [];
	if(obj.id){
		sql += " AND a.userid LIKE ?";
		id = "%" + obj.id + "%"
		key.push(id);
	}
	if(obj.sex && obj.sex !== '0'){
		sql += " AND u.sex = ?";
		key.push(obj.sex);
	}
	sql += " LIMIT ?,?";
	key.push(offset,limit)
	database.driver.execQuery(sql,key,function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result);
	})
}

module.exports.findByKey = function(key,offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT a.id, a.userid, u.username, u.sex, a.submitDate, a.approvalState, a.reason FROM users as u, adjustlist as a WHERE u.userid = a.userid";
	if(key && key !== '0'){
		sql += " AND a.approvalState = ? LIMIT ?,?";
		database.driver.execQuery(sql,[key,offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		})
	}else{
		sql += " LIMIT ?,?";
		database.driver.execQuery(sql,[offset,limit],function(err,result){
			if(err) return cb("查询执行出错");
			cb(null,result);
		})
	}
}

/**
 * 关键词对象模糊查询申请调整已通过审批学生用户数量
 * 
 * @param  {[type]}   obj 关键词对象
 * @param  {Function} cb  回调函数
 */
module.exports.countByObj = function(obj,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM users as u, adjustlist as a WHERE u.userid = a.userid AND a.approvalState = 2";
	key = [];
	if(obj.id){
		sql += " AND a.userid LIKE ?";
		id = "%" + obj.id + "%";
		key.push(id);
	}
	if(obj.sex && obj.sex !== '0'){
		sql += " AND u.sex = ?";
		key.push(obj.sex);
	}
	database.driver.execQuery(sql,key,function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result[0]["count"]);
	})
}

module.exports.countByKey = function(key,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT count(*) as count FROM adjustlist ";
	if(key && key !== '0') {
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
 * 更新申请审批状态
 * 
 * @param  {[type]}   obj 修改对象
 * @param  {Function} cb  回调函数
 */
module.exports.updateState = function(obj,cb) {
	daoModule.update("AdjustModel",obj.id,obj,cb);
}
