var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var _ = require('lodash');
var DmtyManageDAO = require(path.join(process.cwd(),"dao/DormitoryManageDAO"));
var BuildManageDAO = require(path.join(process.cwd(),"dao/BuildManageDAO"));

/**
 * 获取所有宿舍信息
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
module.exports.getAllDormitory = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");

	DmtyManageDAO.countByKey(conditions["query"],function(err,count) {
		key = conditions["query"];
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);

		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		DmtyManageDAO.findByKey(key,offset,limit,function(err,result){
			var Dormitories = {};
			// 处理楼栋信息
			for(idx in result) {
				var dormitory = result[idx];
				if(!Dormitories[dormitory.buildingId]){
					Dormitories[dormitory.buildingId] = {
						"id":dormitory.id,
						"dmtyId":dormitory.buildingId,
						"allCapacity":0,
						"idleCapacity":0,
						"identify":0,
						"children":[]
					};
				}
			}
			// 处理宿舍信息
			for(idx in result) {
				var dormitory = result[idx];
				building = Dormitories[dormitory.buildingId]
				if(building){
					building.children.push({
						"id":dormitory.id,
						"dmtyId":dormitory.roomId,
						"allCapacity":dormitory.allCapacity,
						"idleCapacity":dormitory.idleCapacity,
						"members":dormitory.members? dormitory.members.split(','):dormitory.members,
						"identify":1
					});
					building.allCapacity += dormitory.allCapacity;
					building.idleCapacity += dormitory.idleCapacity;
				}
			}
			// 创建 object 自身可枚举属性的值为数组。
			Result = _.values(Dormitories);
			// 排序
			Result = _.sortBy(Result,"id");
			for(idx in Result) {
				subresult = Result[idx];
				subresult.children = _.sortBy(subresult.children,"dmtyId");
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["dormitory"] = Result;
			cb(err,resultData);
		});
	});
}

/**
 * 查询楼栋信息
 * 
 * @param  {Function} cb 		 回调函数
 */
module.exports.getBuilding = function(cb) {
	BuildManageDAO.list(function(err,result){
		if(err) return cb(err)
		var Building = []
		for(idx in result){
			building = result[idx]
			Building.push({
				"label":parseInt(building.buildingId)+'号楼',
				"value":building.buildingId
			})
		}
		cb(null,Building)
	})
}

/**
 * 创建宿舍
 * 
 * @param  {[type]}   dormitory 宿舍信息对象
 * @param  {Function} cb        回调函数
 */
module.exports.createDormitory = function(dormitory,cb) {
	DmtyManageDAO.findOne({"buildingId":dormitory.buildingId,"roomId":dormitory.roomId},function(err,result){
		if(!result){
			BuildManageDAO.findOne({"buildingId":dormitory.buildingId},function(err,result){
				if(!result) return cb("不存在此楼栋")
				var obj = {
					"buildingId":result.buildingId,
					"roomNums":result.roomNums + 1
				}
				BuildManageDAO.update(obj,function(err,result){
					if(err) return cb("更新roomNums失败~");
					DmtyManageDAO.create({
						"buildingId":dormitory.buildingId,
						"roomId":dormitory.roomId,
						"allCapacity":dormitory.capacity,
						"idleCapacity":dormitory.capacity,
						"accountBalance":0,
						"members":''
					},function(err,result){
						if(err) return cb("添加宿舍失败")
						cb(null,"添加宿舍成功！");
					});
				})
			})
		}else{
			return cb("该宿舍已存在")
		}
	})
}

/**
 * 通过id 获取宿舍信息
 * 
 * @param  {[type]}   id 宿舍id
 * @param  {Function} cb 回调函数
 */
module.exports.getDormitoryInfo = function(id,cb) {
	DmtyManageDAO.show(id,function(err,result){
		if(err) return cb(err);
		if(!result) return cb("该宿舍不存在");
		cb(
			null,
			{
				"id":result.id,
				"buildingId":result.buildingId,
				"roomId":result.roomId,
				"capacity":result.allCapacity,
			}
		);
	});
}

/**
 * 修改宿舍信息
 *
 * @param  {[type]}   obj  		 宿舍信息对象
 * @param  {Function} cb         回调函数
 */
module.exports.updateDormitoryInfo = function(obj,cb) {
	DmtyManageDAO.update(obj,function(error,res) {
		if(error) return cb("修改宿舍信息失败");
		cb(null,"修改宿舍信息成功");
	});
}

/**
 * 通过宿舍 ID 进行删除操作
 * 
 * @param  {[type]}   id 宿舍ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteDormitory = function(id,cb) {
	DmtyManageDAO.findOne({"id":id},function(err,result){
		if(!result) return cb("不存在此宿舍")
		if(result.members) return cb("宿舍已分配学生，删除之前请先调整")
		BuildManageDAO.findOne({"buildingId":result.buildingId},function(err,result){
			if(!result) return cb("不存在此楼栋")
			var obj = {
				"buildingId":result.buildingId,
				"roomNums":result.roomNums - 1
			}
			BuildManageDAO.update(obj,function(err,result){
				if(err) return cb("更新roomNums失败")
				DmtyManageDAO.destroy(id,function(err){
					if(err) return cb("删除宿舍失败");
					cb(null);
				})
			})
		})
	});
}

/**
 * 获取所有宿舍信息(级联选择器)
 * @param  {Function} cb         回调函数
 */
module.exports.getDmty = function(cb) {
		DmtyManageDAO.list(function(err,result){
			var Dormitories = {};
			// 处理楼栋信息
			for(idx in result) {
				var dormitory = result[idx];
				if(!Dormitories[dormitory.buildingId]){
					Dormitories[dormitory.buildingId] = {
						"label": parseInt(dormitory.buildingId) + '号楼',
						"value": dormitory.buildingId,
						"children":[]
					};
				}
			}
			// 处理宿舍信息
			for(idx in result) {
				var dormitory = result[idx];
				building = Dormitories[dormitory.buildingId]
				if(building){
					building.children.push({
						"label":dormitory.roomId,
						"value":dormitory.roomId
					});
				}
			}
			// 创建 object 自身可枚举属性的值为数组。
			Result = _.values(Dormitories);
			// 排序
			Result = _.sortBy(Result,"value");
			for(idx in Result) {
				subresult = Result[idx];
				subresult.children = _.sortBy(subresult.children,"value");
			}
			cb(err,Result);
		});
}