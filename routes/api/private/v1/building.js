var express = require('express');
var router = express.Router();
var path = require("path");
var buildingService = require(path.join(process.cwd(),"/services/BuildingService"));

// 获取楼栋列表
router.get("/",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
		if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		buildingService.getAllBuildings(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取楼栋列表成功");
			})
	}
);

//添加楼栋
router.post("/",
	// 验证参数
	function(req,res,next) {
		if(!req.body.buildingId){
			return res.sendResult(null,400,"楼栋号不能为空");
		}
		if(!req.body.identify) {
			return res.sendResult(null,400,"楼栋标识不能为空");
		}
		if(!req.body.buildingHeight) {
			return res.sendResult(null,400,"楼层高不能为空");
		}
		if(!req.body.roomNums) {
			return res.sendResult(null,400,"房间数不能为空");
		}
		if(!req.body.BAName) {
			return res.sendResult(null,400,"宿管姓名不能为空");
		}
		if(!req.body.BATel) {
			return res.sendResult(null,400,"宿管电话不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		params = {
			"buildingId":req.body.buildingId,
			"identify":req.body.identify,
			"buildingHeight":req.body.buildingHeight,
			"buildingDesc":req.body.buildingDesc,
			"roomNums":req.body.roomNums,
			"BAName":req.body.BAName,
			"BATel":req.body.BATel
		}
		buildingService.createBuilding(params,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,201,"添加楼栋成功");
		})
	}
);

//获取楼栋信息
router.get("/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"buildingId不能为空");
		}
		next();
	},
	function(req,res,next) {
		buildingService.getBuildingInfo(req.params.id,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取楼栋信息成功");
		});
	}
);

// 修改楼栋信息
router.put("/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"buildingId不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		if(req.body.identify == '男生宿舍'){
			identify = 1
		}else if(req.body.identify == '女生宿舍'){
			identify = 2
		}else {
			identify = req.body.identify
		}
		buildingService.updateBuildingInfo({
			"buildingId":req.params.id,
			"identify":identify,
			"buildingHeight":req.body.buildingHeight,
			"roomNums":req.body.roomNums,
			"BAName":req.body.BAName,
			"BATel":req.body.BATel,
			"buildingDesc":req.body.buildingDesc
		},function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"修改楼栋信息成功");
		})
	}
);

// 删除楼栋信息
router.delete("/:id",
	// 验证参数
	function(req,res,next){
		if(!req.params.id) return res.sendResult(null,400,"id不能为空");
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
		buildingService.deleteBuilding(req.params.id,function(err){
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除楼栋成功");
		})
	}
);

module.exports = router;