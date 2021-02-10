var express = require('express');
var router = express.Router();
var path = require("path");
var homeService = require(path.join(process.cwd(),"/services/HomeService"));

// 获取轮播图地址
router.get("/picPath",
	//处理业务逻辑
	function(req,res,next) {
		homeService.getCarousel(function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取轮播图地址成功");
		});
	}
);

// 获取用户个人信息
router.get("/",
	//处理业务逻辑
	function(req,res,next) {
		homeService.getUserInfo(req.userInfo,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取用户个人信息成功");
		});
	}
);

// 修改密码
router.put("/updatepwd",
	// 处理业务逻辑
	function(req,res,next) {
		homeService.updatePassword(req.userInfo,req.body.newPwd,req.body.code,'更改密码',function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"修改成功");
			})
	}
);

// 修改联系方式
router.put("/updatecontactinfo",
	// 处理业务逻辑
	function(req,res,next) {
		homeService.updateContactInfo(req.userInfo,req.body.tel,req.body.email,req.body.code,'更改联系方式',function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"修改成功");
			})
	}
);

// 获取公告列表
router.get("/notice",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
		if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		homeService.getAllNotices(
			{
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取公告列表成功");
			})
	}
);

// 添加公告
router.post("/notice",
	// 验证参数
	function(req,res,next) {
		if(!req.body.title){
			return res.sendResult(null,400,"标题不能为空");
		}
		if(!req.body.content) {
			return res.sendResult(null,400,"内容不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		params = {
			"title":req.body.title,
			"content":req.body.content,
		}
		homeService.createNotice(params,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,201,"添加成功");
		})
	}
);

//获取单个公告信息
router.get("/notice/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"公告ID不能为空");
		}
		if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"公告ID必须是数字");
		next();
	},
	function(req,res,next) {
		homeService.getNotice(req.params.id,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取公告成功");
		});
	}
);

// 修改公告信息
router.put("/notice/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"公告ID不能为空");
		}
		if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"公告ID必须是数字");
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		homeService.updateNotice(req.params.id,req.body.title,req.body.content,
			function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"更新公告成功");
			})
	}
);

// 删除公告信息
router.delete("/notice/:id",
	// 验证参数
	function(req,res,next){
		if(!req.params.id) return res.sendResult(null,400,"公告ID不能为空");
		if(isNaN(parseInt(req.params.id))) return res.sendResult(null,400,"ID必须是数字");
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
		homeService.deleteNotice(req.params.id,function(err){
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除公告成功");
		})
	}
);
module.exports = router;