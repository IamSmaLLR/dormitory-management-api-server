var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var AssignManageDAO = require(path.join(process.cwd(),"dao/AssignManageDAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));

/**
 * 获取所有未分配宿舍学生用户
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"query" : 关键词查询,
		"sex" : 性别查询,
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param  {Function} cb         回调函数
 */

module.exports.getAssignedUsers = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	obj = {
		"id" : conditions["query"],
		"sex" : conditions["sex"]
		}
	// 通过关键词获取学生数量
	AssignManageDAO.countByObj(obj,function(err,count) {
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		AssignManageDAO.findByObj(obj,offset,limit,function(err,result){
			var Students = [];
			for(idx in result) {
				var student = result[idx];
				Students.push({
					"userid":student.userid,
					"username":student.username,
					"sex":student.sex,
					"collegeMajor":student.collegeMajor
				});
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["users"] = Students;
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
module.exports.getStu = function(id,cb) {
	UserManageDAO.show(id,function(err,result){
		if(err) return cb(err);
		if(!result) return cb("该学生不存在");
		cb(
			null,
			{
				"userid":result.userid,
				"username":result.username,
				"sex":result.sex
			}
		);
	});
}

/**
 * 分配宿舍
 *
 * @param  {[type]}   userid  	   用户id
 * @param  {[type]}   username     用户姓名
 * @param  {[type]}   buildingId   分配楼栋号
 * @param  {[type]}   roomId       分配宿舍号
 * @param  {[type]}   sex          用户性别
 * @param  {Function} cb         回调函数
 */
module.exports.assignDormitory = function(userid,username,buildingId,roomId,sex,cb) {
	AssignManageDAO.findIdentify({"buildingId":buildingId},function(err,result){
		if(err) return cb("查询楼栋错误")
		if(!result) return cb("查无此楼栋")
		if(result.identify == 1 && sex == 2) return cb("请勿将女生分配在男生宿舍")
		if(result.identify == 2 && sex == 1) return cb("请勿将男生分配在女生宿舍")
		AssignManageDAO.findOne({"buildingId":buildingId,"roomId":roomId},function(err,result){
			if(err) return cb("查询楼栋宿舍错误")
			if(!result) return cb("查无此宿舍")
			if(result.idleCapacity == 0) return cb("宿舍人员已满")
			var obj = {
				"userid":userid,
				"buildingId":buildingId,
				"roomId":roomId,
				"idleCapacity":result.idleCapacity - 1,
				"members":result.members ? result.members += ',' + userid + username : userid + username
			}
			AssignManageDAO.update(obj,function(error,res) {
				if(error) return cb("分配宿舍失败");
				cb(null,"分配宿舍成功成功");
			});
		})
	})
}