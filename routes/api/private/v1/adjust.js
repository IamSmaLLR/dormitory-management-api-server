var express = require('express');
var router = express.Router();
var path = require("path");
var adjustService = require(path.join(process.cwd(),"/services/AdjustService"));

// 学生组件路由

// 获取用户个人信息
router.get("/userInfo",
	//处理业务逻辑
	function(req,res,next) {
		adjustService.getUserInfo(req.userInfo,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取用户个人信息成功");
		});
	}
);

// 获取用户申请调整宿舍单
router.get("/submit",
	//处理业务逻辑
	function(req,res,next) {
		adjustService.getSubmitList(req.userInfo,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取用户调整宿舍申请单成功");
		});
	}
);

//上传调整宿舍申请
router.post("/apply",
	// 验证参数
	function(req,res,next) {
		if(!req.body.userid){
			return res.sendResult(null,400,"学号不能为空");
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
			"reason":req.body.reason
		}
		adjustService.createSubmit(params,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,201,"宿舍调整申请成功");
		})
	}
);


// 管理员组件路由
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
		adjustService.getAdjustedUsers(
			{
				"query":req.query.query,
				"sex":req.query.sex,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取申请调整宿舍学生列表成功");
			})
	}
);

router.get("/approval",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
		if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		adjustService.getApprovalUsers(
			{
				"approvalState":req.query.approvalState,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取申请调整宿舍审批列表成功");
			})
	}
);

// 更新审批状态
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
		adjustService.updateState(req.params.id,req.body.approvalState,
			function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"更新审批状态成功");
			})
	}
);

// 分配宿舍
router.put("/:userid/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.userid) {
			return res.sendResult(null,400,"userid不能为空");
		}
		if(!req.params.id) {
			return res.sendResult(null,400,"id不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		adjustService.adjustDormitory(req.params.id,req.params.userid,req.body.username,req.body.buildingId,req.body.roomId,req.body.sex,
			function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"调整宿舍成功");
			})
	}
);

module.exports = router;