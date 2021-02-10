var express = require('express');
var router = express.Router();
var path = require("path");
var reportsService = require(path.join(process.cwd(),"/services/ReportsService"));

router.get("/users/:sex",
	//处理业务逻辑
	function(req,res,next) {
		reportsService.getSexNums(req.params.sex,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取学生数量成功");
		});
	}
);

router.get("/assign",
	//处理业务逻辑
	function(req,res,next) {
		reportsService.getAssignNums(function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取数量成功");
		});
	}
);
router.get("/adjust",
	//处理业务逻辑
	function(req,res,next) {
		reportsService.getAdjustNums(function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取数量成功");
		});
	}
);

router.get("/assign",
	//处理业务逻辑
	function(req,res,next) {
		reportsService.getAssignNums(function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取数量成功");
		});
	}
);

router.get("/repair",
	//处理业务逻辑
	function(req,res,next) {
		reportsService.getRepairNums(function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取数量成功");
		});
	}
);

router.get("/pay",
	//处理业务逻辑
	function(req,res,next) {
		reportsService.getPayNums(function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取数量成功");
		});
	}
);

router.get("/rent",
	//处理业务逻辑
	function(req,res,next) {
		reportsService.getRentNums(function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取数量成功");
		});
	}
);
module.exports = router;