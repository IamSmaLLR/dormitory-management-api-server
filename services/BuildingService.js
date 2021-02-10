var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var BuildManageDAO = require(path.join(process.cwd(),"dao/BuildManageDAO"));
var DmtyManageDAO = require(path.join(process.cwd(),"dao/DormitoryManageDAO"));

/**
 * 获取所有楼栋信息
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

module.exports.getAllBuildings = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");

	BuildManageDAO.countByKey(conditions["query"],function(err,count) {
		key = conditions["query"];
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);

		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		BuildManageDAO.findByKey(key,offset,limit,function(err,result){
			var Building = [];
			for(idx in result) {
				var building = result[idx];
				Building.push({
					"id":building.id,
					"buildingId":building.buildingId,
					"identify":building.identify,
					"buildingHeight":building.buildingHeight,
					"roomNums":building.roomNums,
					"buildingDesc":building.buildingDesc,
					"BAName":building.BAName,
					"BATel":building.BATel
				});
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["buildings"] = Building;
			cb(err,resultData);
		});
	});
}

/**
 * 创建楼栋
 * 
 * @param  {[type]}   building 楼栋信息
 * @param  {Function} cb       回调函数
 */
module.exports.createBuilding = function(building,cb) {
	BuildManageDAO.findOne({"buildingId":building.buildingId},function(err,result){
		if(!result){
			BuildManageDAO.create({
				"buildingId":building.buildingId,
				"identify":building.identify,
				"buildingHeight":building.buildingHeight,
				"roomNums":building.roomNums,
				"buildingDesc":building.buildingDesc,
				"BAName":building.BAName,
				"BATel":building.BATel
			},function(err,result){
				if(err) return cb("添加楼栋失败~");
				cb(null,"添加楼栋成功！");
			});
		}else{
			return cb("该楼栋已存在")
		}
	})
}

/**
 * 通过楼栋号 获取楼栋信息
 * 
 * @param  {[type]}   buildingId 楼栋号
 * @param  {Function} cb 		 回调函数
 */
module.exports.getBuildingInfo = function(id,cb) {
	BuildManageDAO.show(id,function(err,result){
		if(err) return cb(err);
		if(!result) return cb("该楼栋不存在");
		cb(
			null,
			{
				"id":result.id,
				"buildingId":result.buildingId,
				"identify":result.identify==1? '男生宿舍':'女生宿舍',
				"buildingHeight":result.buildingHeight,
				"roomNums":result.roomNums,
				"buildingDesc":result.buildingDesc,
				"BAName":result.BAName,
				"BATel":result.BATel
			}
		);
	});
}

/**
 * 修改楼栋信息
 *
 * @param  {[type]}   obj  		 楼栋信息对象
 * @param  {Function} cb         回调函数
 */
module.exports.updateBuildingInfo = function(obj,cb) {
	BuildManageDAO.update(obj,function(error,res) {
		if(error) return cb("修改楼栋信息失败");
		cb(null,"修改楼栋信息成功");
	});
}

/**
 * 通过楼栋 ID 进行删除操作
 * 
 * @param  {[type]}   id 楼栋ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteBuilding = function(id,cb) {
	BuildManageDAO.findOne({"id":id},function(err,result){
		DmtyManageDAO.listDmty(result.buildingId,function(err,result){
			var members = []
			for(idx in result){
				var dormitory = result[idx]
				if(dormitory.members){
					members.push(dormitory.members);
				}
			}
			if(members.length) return cb('楼栋中宿舍存在已分配学生，请调整后再删除楼栋！')
			BuildManageDAO.destroy(id,function(err){
				if(err) return cb("删除楼栋失败");
				cb(null);
			});
		})
	})
}