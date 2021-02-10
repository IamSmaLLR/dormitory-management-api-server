var path = require('path');
daoModule = require('./DAO.js');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 创建公告通知
 * 
 * @param  {[type]}   obj 公告通知对象
 * @param  {Function} cb  回调函数
 */
module.exports.create = function(obj,cb) {
	daoModule.create("NoticeModel",obj,cb);
}

/**
 * 获取新闻公告列表
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb         回调函数
 */
module.exports.list = function(conditions,cb) {
	daoModule.list("NoticeModel",conditions,function(err,models) {
		if(err) return cb(err,null);
		cb(null,models);
	});
}

/**
 * 通过分页查询公告通知
 * 
 * @param  {[type]}   offset 
 * @param  {[type]}   limit  
 * @param  {Function} cb     回调函数
 */
module.exports.find = function(offset,limit,cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM noticelist LIMIT ?,?";
	database.driver.execQuery(sql,[offset,limit],function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result);
	});
}

/**
 * 通过ID获取新闻公告对象数据
 * 
 * @param  {[type]}   id 新闻公告主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.show = function(id,cb) {
	daoModule.show("NoticeModel",id,cb);
}

/**
 * 更新公告通知信息
 * 
 * @param  {[type]}   obj 公告对象
 * @param  {Function} cb  回调函数
 */
module.exports.update = function(obj,cb) {
	daoModule.update("NoticeModel",obj.id,obj,cb);
}

/**
 * 删除公告通知对象数据
 * 
 * @param  {[type]}   id 主键ID
 * @param  {Function} cb 回调函数
 */
module.exports.destroy = function(id,cb) {
	daoModule.destroy("NoticeModel",id,function(err){
		if(err) return cb(err);
		return cb(null);
	});
}

/**
 * 获取公告通知数量
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.count = function(cb) {
	daoModule.count("NoticeModel",cb);
}

//获取轮播图图片
module.exports.findCarousel = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT * FROM carousel";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb("查询执行出错");
		cb(null,result);
	});
}