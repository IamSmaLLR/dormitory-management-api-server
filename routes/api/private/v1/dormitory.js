var express = require('express');
var router = express.Router();
var path = require("path");
var dmtyService = require(path.join(process.cwd(),"/services/DormitoryService"));

// 获取宿舍列表
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
		dmtyService.getAllDormitory(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取宿舍列表成功");
			})
	}
);

//获取楼栋信息
router.get("/building",
	function(req,res,next) {
		dmtyService.getBuilding(function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取楼栋信息成功");
		});
	}
);

//添加楼栋
router.post("/",
	// 验证参数
	function(req,res,next) {
		if(!req.body.buildingId){
			return res.sendResult(null,400,"楼栋号不能为空");
		}
		if(!req.body.roomId) {
			return res.sendResult(null,400,"宿舍号不能为空");
		}
		if(!req.body.capacity) {
			return res.sendResult(null,400,"容纳人数不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		params = {
			"buildingId":req.body.buildingId,
			"roomId":req.body.roomId,
			"capacity":req.body.capacity,
		}
		dmtyService.createDormitory(params,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,201,"添加宿舍成功");
		})
	}
);

// 获取宿舍信息
router.get("/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"id不能为空");
		}
		next();
	},
	function(req,res,next) {
		dmtyService.getDormitoryInfo(req.params.id,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取宿舍信息成功");
		});
	}
);

// 修改宿舍信息
router.put("/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"id不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		dmtyService.updateDormitoryInfo({
			"id":req.params.id,
			"allCapacity":req.body.capacity
		},function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"修改宿舍信息成功");
		})
	}
);

// 删除宿舍信息
router.delete("/:id",
	// 验证参数
	function(req,res,next){
		if(!req.params.id) return res.sendResult(null,400,"id不能为空");
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
		dmtyService.deleteDormitory(req.params.id,function(err){
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除宿舍成功");
		})
	}
);

// 获取级联选择器宿舍信息
router.get("/cascader/info",
	function(req,res,next) {
		dmtyService.getDmty(function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取楼栋宿舍信息成功");
		});
	}
);

module.exports = router;