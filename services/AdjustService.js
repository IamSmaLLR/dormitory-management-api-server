var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var AdjustManageDAO = require(path.join(process.cwd(),"dao/AdjustManageDAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));
var AssignManageDAO = require(path.join(process.cwd(),"dao/AssignManageDAO"));


// 学生组件页面逻辑

/**
 * 获取用户信息数据
 * 
 * @param   {Object}   userInfo token中的携带信息
 * @param   {Function} cb       回调函数
 */

module.exports.getUserInfo = function(userInfo,cb) {
	if(!userInfo) return cb("无权限访问");
	uid = userInfo.uid;
	
	UserManageDAO.findOne({"userid":uid},function(err,result) {
		if(err || !result) return cb("用户不存在");
		cb(null,{"userid":result.userid,"username":result.username});
	})
}

/**
 * 创建宿舍调整申请单
 * 
 * @param  {[type]}   submit  提交内容
 * @param  {Function} cb      回调函数
 */
module.exports.createSubmit = function(submit,cb) {
	AdjustManageDAO.findOne({"userid":submit.userid},function(err,result){
		if(!result || result.approvalState == 3 || result.approvalState == 4){
			AdjustManageDAO.create({
				"userid":submit.userid,
				"reason":submit.reason,
				"submitDate":(new Date().getTime()),
				"approvalState":1,
				"buildingId":'',
				"roomId":''
			},function(err,result){
				if(err) return cb("宿舍调整申请失败~");
				cb(null,"宿舍调整申请成功");
			});
		}else{
			return cb("您有在进行中的宿舍调整申请")
		}
	})
}

/**
 * 获取学生提交的调整申请单
 * 
 * @param   {[type]}   userid   学生id
 * @param   {Function} cb       回调函数
 */

module.exports.getSubmitList = function(userInfo,cb) {	
	if(!userInfo) return cb("无权限访问");
	userid = userInfo.uid;
	AdjustManageDAO.listSubmit(userid,function(err,result) {
		if(err || !result) return cb("您没有调整宿舍申请");
		var applyList = []
		for(idx in result){
			item = result[idx]
			applyList.push({
				"userid":item.userid,
				"username":item.username,
				"submitDate":item.submitDate,
				"approvalDate":item.approvalDate,
				"buildingId":item.buildingId,
				"roomId":item.roomId,
				"approvalState":item.approvalState,
				"sex":item.sex
			})
		}
		cb(null,applyList);
	})
}

// 管理员组件页面逻辑

/**
 * 获取所有申请调整审批通过学生用户
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

module.exports.getAdjustedUsers = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	obj = {
		"id" : conditions["query"],
		"sex" : conditions["sex"]
		}
	// 通过关键词获取学生数量
	AdjustManageDAO.countByObj(obj,function(err,count) {
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		AdjustManageDAO.findByObj(obj,offset,limit,function(err,result){
			var Students = [];
			for(idx in result) {
				var student = result[idx];
				Students.push({
					"id":student.id,
					"userid":student.userid,
					"username":student.username,
					"sex":student.sex,
					"buildingId":student.buildingId,
					"roomId":student.roomId,
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
 * 获取所有申请调整待审批学生用户
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"approvalState" : 审批状态,
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param  {Function} cb         回调函数
 */

module.exports.getApprovalUsers = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	// 通过关键词获取学生数量
	AdjustManageDAO.countByKey(conditions["approvalState"],function(err,count) {
		key = conditions["approvalState"]
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		AdjustManageDAO.findByKey(key,offset,limit,function(err,result){
			var Students = [];
			for(idx in result) {
				var student = result[idx];
				Students.push({
					"id":student.id,
					"userid":student.userid,
					"username":student.username,
					"sex":student.sex,
					"submitDate":student.submitDate,
					"approvalState":student.approvalState,
					"reason":student.reason
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
 * 更改审批状态
 *
 * @param  {[type]}   approvalState  审批状态
 * @param  {Function} cb             回调函数
 */
module.exports.updateState = function(id,approvalState,cb) {
	AdjustManageDAO.updateState({"id":id,"approvalState":approvalState,"approvalDate":(new Date().getTime())},function(error,res) {
		if(error) return cb("更新审批状态失败");
		cb(null,"更新审批状态成功");
	});
}

/**
 * 调整宿舍
 *
 * @param  {[type]}   id  	       调整更换列表id
 * @param  {[type]}   userid  	   用户id
 * @param  {[type]}   username     用户姓名
 * @param  {[type]}   buildingId   分配楼栋号
 * @param  {[type]}   roomId       分配宿舍号
 * @param  {[type]}   sex          用户性别
 * @param  {Function} cb         回调函数
 */
module.exports.adjustDormitory = function(id,userid,username,buildingId,roomId,sex,cb) {
	AssignManageDAO.findIdentify({"buildingId":buildingId},function(err,result){
		if(err) return cb("查询楼栋错误")
		if(!result) return cb("查无此楼栋")
		if(result.identify == 1 && sex == 2) return cb("请勿将女生调整在男生宿舍")
		if(result.identify == 2 && sex == 1) return cb("请勿将男生调整在女生宿舍")
		UserManageDAO.findOne({"userid":userid},function(err,result){
			if(result.buildingId == buildingId && result.roomId == roomId) return cb("调整宿舍与学生原宿舍相同，请更换")
			AssignManageDAO.findOne({"buildingId":result.buildingId,"roomId":result.roomId},function(err,result){
				var oldDormitory = {
					"userid":userid,
					"buildingId":result.buildingId,
					"roomId":result.roomId,
					"idleCapacity":result.idleCapacity + 1,
					"members":result.members.indexOf(',') == -1 ? '' : result.members.split(',').indexOf(userid+username) == 0 ? result.members.replace(userid+username+',','') : result.members.replace(','+userid+username,'')
				}
				AssignManageDAO.update(oldDormitory,function(err,result){
					AssignManageDAO.findOne({"buildingId":buildingId,"roomId":roomId},function(err,result){
						if(err) return cb("查询楼栋宿舍错误")
						if(!result) return cb("查无此宿舍")
						if(result.idleCapacity == 0) return cb("宿舍人员已满")
						var newDormitory = {
							"userid":userid,
							"buildingId":buildingId,
							"roomId":roomId,
							"idleCapacity":result.idleCapacity - 1,
							"members":result.members ? result.members += ',' + userid + username : userid + username
						}
						AssignManageDAO.update(newDormitory,function(error,res) {
							AdjustManageDAO.updateState({"id":id,"approvalState":4,"buildingId":buildingId,"roomId":roomId},function(error,res) {
								if(error) return cb("调整宿舍失败");
								cb(null,"调整宿舍成功");
							});
						});
					});
				});
			});
		});
	});
}


