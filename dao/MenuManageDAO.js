var path = require('path');
daoModule = require('./DAO');
databaseModule = require(path.join(process.cwd(),"modules/database"));

/**
 * 获取权限列表
 * 
 * @param  {Function} cb  回调函数
 */
module.exports.list = function(cb) {
	db = databaseModule.getDatabase();
	sql = "SELECT id, authName, path, level, parent, permission FROM menulist";
	database.driver.execQuery(sql,function(err,result){
		if(err) return cb('获取菜单列表失败', null);
		cb(null,result);
	})
}