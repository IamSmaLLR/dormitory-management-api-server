var express = require('express');
var router = express.Router();
var path = require("path");
var codeService = require(path.join(process.cwd(),"/services/CodeService"));

router.post("/post1",
	// 处理业务逻辑
	function(req,res,next) {
		codeService.changeContactInfo(req.userInfo,'更改联系方式',req.body.email,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,200,"验证码发送成功");
		})
	}
);

router.get("/post2",
	// 处理业务逻辑
	function(req,res,next) {
		codeService.changePassword(req.userInfo,'更改密码',function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,200,"验证码发送成功");
		})
	}
);

module.exports = router;