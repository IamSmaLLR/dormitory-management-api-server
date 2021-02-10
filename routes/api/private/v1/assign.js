var express = require('express');
var router = express.Router();
var path = require("path");
var assignService = require(path.join(process.cwd(),"/services/AssignService"));

// 获取未分配宿舍用户列表
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
		assignService.getAssignedUsers(
			{
				"query":req.query.query,
				"sex":req.query.sex,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取未分配学生列表成功");
			})
	}
);

//获取单个学生信息
router.get("/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"userid不能为空");
		}
		next();
	},
	function(req,res,next) {
		assignService.getStu(req.params.id,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取学生信息成功");
		});
	}
);

// 分配宿舍
router.put("/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"userid不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		assignService.assignDormitory(req.params.id,req.body.username,req.body.buildingId,req.body.roomId,req.body.sex,
			function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"分配宿舍成功");
			})
	}
);
module.exports = router;