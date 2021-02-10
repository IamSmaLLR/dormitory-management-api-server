var express = require('express');
var router = express.Router();
var path = require("path");
var repairService = require(path.join(process.cwd(),"/services/RepairService"));

// 学生组件路由

// 获取用户个人信息
router.get("/userInfo",
	//处理业务逻辑
	function(req,res,next) {
		repairService.getUserInfo(req.userInfo,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取用户个人信息成功");
		});
	}
);

// 获取用户申请报修申请单
router.get("/submit",
	//处理业务逻辑
	function(req,res,next) {
		repairService.getSubmitList(req.userInfo,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取用户报修申请单成功");
		});
	}
);

//上传调整宿舍申请
router.post("/apply",
	// 验证参数
	function(req,res,next) {
		if(!req.body.tel){
			return res.sendResult(null,400,"联系方式不能为空");
		}
		if(!req.body.reason){
			return res.sendResult(null,400,"原因不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		params = {
			"userid":req.body.userid,
			"username":req.body.username,
			"dmtyId":req.body.dmtyId,
			"tel":req.body.tel,
			"reason":req.body.reason
		}
		repairService.createSubmit(params,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,201,"宿舍维修申请成功");
		})
	}
);

// 获取报修申请单列表
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
		repairService.getRepairList(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取宿舍维修申请单列表成功");
			})
	}
);

router.put("/:id/:state",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"id不能为空");
		}
		if(!req.params.state) {
			return res.sendResult(null,400,"state不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		repairService.updateRepairListState(req.params.id,req.params.state,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"更改维修申请单状态成功");
		})
	}
);

module.exports = router;