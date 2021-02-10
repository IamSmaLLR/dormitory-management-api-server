var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var RepairManageDAO = require(path.join(process.cwd(),"dao/RepairManageDAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));

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
		cb(null,{"userid":result.userid,"username":result.username,"dmtyId":result.buildingId+'#'+result.roomId});
	})
}

/**
 * 创建报修申请单
 * 
 * @param  {[type]}   submit  提交内容
 * @param  {Function} cb      回调函数
 */
module.exports.createSubmit = function(submit,cb) {
	RepairManageDAO.create({
		"userid":submit.userid,
		"username":submit.username,
		"reason":submit.reason,
		"submitDate":(new Date().getTime()),
		"approvalState":1,
		"buildingId":submit.dmtyId.split('#')[0],
		"roomId":submit.dmtyId.split('#')[1],
		"tel":submit.tel
	},function(err,result){
		if(err) return cb("宿舍报修申请失败~");
		cb(null,"宿舍报修申请成功");
	});
}

/**
 * 获取学生提交的报修申请单
 * 
 * @param   {[type]}   userid   学生id
 * @param   {Function} cb       回调函数
 */

module.exports.getSubmitList = function(userInfo,cb) {	
	if(!userInfo) return cb("无权限访问");
	userid = userInfo.uid;
	RepairManageDAO.listSubmit(userid,function(err,result) {
		if(err || !result) return cb("您没有宿舍报修申请");
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
				"tel":item.tel,
				"reason":item.reason
			})
		}
		cb(null,applyList);
	})
}

/**
 * 获取维修申请单列表
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

module.exports.getRepairList = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	RepairManageDAO.countByState(conditions["query"],function(err,count) {
		var key = conditions["query"]
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		RepairManageDAO.findByState(key,offset,limit,function(err,result){
			var repairList = []
			for(idx in result){
				repair = result[idx]
				repairList.push({
					"id":repair.id,
					"userid":repair.userid,
					"username":repair.username,
					"buildingId":repair.buildingId,
					"roomId":repair.roomId,
					"tel":repair.tel,
					"submitDate":repair.submitDate,
					"approvalState":repair.approvalState,
					"reason":repair.reason
				})
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["repair"] = repairList;
			cb(err,resultData);
		});
	});
}

/**
 * 维修申请单审批
 *
 * @param  {[type]}   id  	     维修列表id
 * @param  {[type]}   state  	 维修申请单状态
 * @param  {Function} cb         回调函数
 */
module.exports.updateRepairListState = function(id,state,cb) {
	if(state == 3) {
		RepairManageDAO.updateState({"id":id,"approvalState":state,"approvalDate":(new Date().getTime())},function(err,result){
			if(err) return cb("更新维修申请单状态失败");
			cb(null,"驳回维修申请单成功");
		})
	} else if(state == 4) {
		RepairManageDAO.updateState({"id":id,"approvalState":state},function(err,result){
			if(err) return cb("更新维修申请单状态失败");
			cb(null,"维修单已完成");
		})
	} else if(state == 2){
		RepairManageDAO.updateState({"id":id,"approvalState":state,"approvalDate":(new Date().getTime())},function(err,result){
			if(err) return cb("更新维修申请单状态失败");
			cb(null,"维修申请单审批通过，等待维修");
		})
	}
}