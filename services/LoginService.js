var path = require("path");
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));
var Password = require("node-php-password");
var logger = require('../modules/logger').logger();
/**
 * 用户登录
 * @param  {[type]}   userid   用户名
 * @param  {[type]}   password 密码
 * @param  {Function} cb       回调
 */
module.exports.login = function(userid,password,cb) {
	logger.debug('login => userid:%s,password:%s',userid,password);
	logger.debug(userid);
	UserManageDAO.findOne({"userid":userid},function(err,result) {
		logger.debug(err);	
		if(err || !result) return cb("用户不存在");
		if(Password.verify(password, result.password)){
			cb(
				null,
				{
					"userid":result.userid,
					"username":result.username,
					"sex":result.sex,
					"tel":result.tel,
					"email":result.email,
					"collegeMajor":result.collegeMajor,
					"buildingId":result.buildingId,
					"roomId":result.roomId,
					"avatar":result.avatar,
					"isAdmin":result.isAdmin,
				}
			);
		} else {
			return cb("密码错误");
		}
	});
}