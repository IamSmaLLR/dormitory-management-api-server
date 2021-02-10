var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var MenuManageDAO = require(path.join(process.cwd(),"dao/MenuManageDAO"));

/**
 * 获取左侧菜单数据
 * 
 * @param  {Function} cb 回调函数
 */

module.exports.getLeftMenus = function(userInfo,cb) {
	if(!userInfo) return cb("无权限访问");
	rid = userInfo.rid;
	
	var authFn = function(rid,cb) {
		MenuManageDAO.list(function(err,result){
			if(err) return cb("获取菜单数据失败");
			var rootPermissionsResult = {};
			// 处理一级菜单
			for(idx in result) {
				permission = result[idx];
				if(permission.level == 1 && permission.permission == rid) {
					rootPermissionsResult[permission.id] = {
						"id":permission.id,
						"authName":permission.authName,
						"path":permission.path,
						"children":[]
					};
				}
			}
	
			// 处理二级菜单
			for(idx in result) {
				permission = result[idx];
				if(permission.level == 2 && permission.permission == rid) {
					parentPermissionResult = rootPermissionsResult[permission.parent];
					if(parentPermissionResult) {
						parentPermissionResult.children.push({
							"id":permission.id,
							"authName":permission.authName,
							"path":permission.path,
							"children":[]
						});
					}
				}
			}
			// 创建 object 自身可枚举属性的值为数组。
			result = _.values(rootPermissionsResult);
			// 排序
			result = _.sortBy(result,"id");
			for(idx in result) {
				subresult = result[idx];
				subresult.children = _.sortBy(subresult.children,"id");
			}
	
			cb(null,result);
		});
	}
	authFn(rid,cb);
}