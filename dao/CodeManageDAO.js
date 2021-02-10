var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建邮箱验证码
 * 
 * @param  {[type]}   obj 申请信息
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("CodeModel",obj,cb);
}

/**
 * 通过查询条件获取验证码对象
 * 
 * @param  {[type]}   conditions 条件
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function(conditions,cb) {
	daoModule.findOne("CodeModel",conditions,cb);
}

/**
 * 删除验证码对象数据
 * 
 * @param  {[type]}   id 主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.destroy = function(userid,type,cb) {
	db = databaseModule.getDatabase();
	sql = "DELETE FROM codelist WHERE userid = ? AND type = ?";
	database.driver.execQuery(sql,[userid,type],function(err,result){
		if(err) return cb("删除执行出错");
		cb(null,result);
	});
}