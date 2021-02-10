var express = require('express');
var router = express.Router();
var path = require("path");
var userService = require(path.join(process.cwd(),"/services/UserService"));

// 获取用户列表
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
		userService.getAllUsers(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取学生列表成功");
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
		userService.getUser(req.params.id,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取学生信息成功");
		});
	}
);

// 修改学生用户信息
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
		if(req.body.password){
		userService.updateUserInfo(req.params.id,req.body.password,req.body.tel,req.body.email,
			function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"修改信息成功");
			})
		} else {
		userService.updateUserInfo(req.params.id,'undefined',req.body.tel,req.body.email,
			function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"修改信息成功");
			})			
		}
	}
);

// 删除用户信息
router.delete("/:id",
	// 验证参数
	function(req,res,next){
		if(!req.params.id) return res.sendResult(null,400,"userid不能为空");
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
		userService.deleteUser(req.params.id,function(err){
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除用户成功");
		})
	}
);

module.exports = router;