var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));
var Password = require("node-php-password");
var logger = require('../modules/logger').logger();

/**
 * 获取所有学生用户
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

module.exports.getAllUsers = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");

	// 通过关键词获取学生数量
	UserManageDAO.countByKey(conditions["query"],function(err,count) {
		key = conditions["query"];
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);

		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		UserManageDAO.findByKey(key,offset,limit,function(err,result){
			var User = [];
			for(idx in result) {
				var student = result[idx];
				User.push({
					"userid":student.userid,
					"username":student.username,
					"email":student.email,
					"tel":student.tel
				});
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["users"] = User;
			cb(err,resultData);
		});
	});
}

/**
 * 通过用户ID 获取学生信息
 * 
 * @param  {[type]}   id 用户ID
 * @param  {Function} cb 回调函数
 */
module.exports.getUser = function(id,cb) {
	UserManageDAO.show(id,function(err,result){
		if(err) return cb(err);
		if(!result) return cb("该学生不存在");
		cb(
			null,
			{
				"userid":result.userid,
				"username":result.username,
				"email":result.email,
				"tel":result.tel,
				"sex":result.sex,
				"collegeMajor":result.collegeMajor
			}
		);
	});
}

/**
 * 修改学生用户信息
 * 
 * @param  {[type]}   password   用户密码
 * @param  {[type]}   tel  		 用户电话
 * @param  {[type]}   email      用户邮箱
 * @param  {Function} cb         回调函数
 */
module.exports.updateUserInfo = function(userid,password,tel,email,cb) {
	if(password !== 'undefined'){
		logger.debug('updateUserInfo=>updatePassword => userid:%s,new password:%s',userid,password);
		UserManageDAO.findOne({"userid":userid},function(err,result) {
			logger.debug(err);	
			if(err || !result) return cb("用户不存在");
			if(Password.verify(password, result.password)){
				return cb("新旧密码一致不需修改~");
			} else {
				var hashpwd = Password.hash(password);
				UserManageDAO.update({"userid":userid,"password":hashpwd,"tel":tel,"email":email},function(error,res) {
						if(error) return cb("修改学生用户信息失败");
						cb(null,"修改学生用户信息成功");
				});
			}
		});
	}else{
		UserManageDAO.update({"userid":userid,"tel":tel,"email":email},function(error,res) {
			if(error) return cb("修改学生用户信息失败");
			cb(null,"修改学生用户信息成功");
		});
	}
}

/**
 * 通过学号 ID 进行删除操作
 * 
 * @param  {[type]}   id 公告ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteUser = function(id,cb) {
	UserManageDAO.destroy(id,function(err){
		if(err) return cb("删除用户失败");
		cb(null);
	});
}