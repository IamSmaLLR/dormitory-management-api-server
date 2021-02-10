var express = require('express');
var router = express.Router();
var path = require("path");
var powerService = require(path.join(process.cwd(),"/services/PowerService"));

//查询宿舍电费
router.get("/query",
	// 参数验证
	function(req,res,next) {
		if(!req.query.buildingId) {
			return res.sendResult(null,400,"楼栋号不能为空");
		}
		if(!req.query.roomId) {
			return res.sendResult(null,400,"房间号不能为空");
		}
		next();
	},
	function(req,res,next) {
		powerService.getDmtyBalance(req.query.buildingId,req.query.roomId,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取宿舍电费成功");
		});
	}
);

//添加缴费订单
router.post("/",
	// 验证参数
	function(req,res,next) {
		if(!req.body.buildingId){
			return res.sendResult(null,400,"楼栋号不能为空");
		}
		if(!req.body.roomId) {
			return res.sendResult(null,400,"宿舍号不能为空");
		}
		if(!req.body.payBalance) {
			return res.sendResult(null,400,"缴费金额不能为空");
		}
		if(!req.body.payMethod) {
			return res.sendResult(null,400,"缴费方式不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		params = {
			"buildingId":req.body.buildingId,
			"roomId":req.body.roomId,
			"payBalance":req.body.payBalance,
			"payMethod":req.body.payMethod
		}
		powerService.createOrder(req.userInfo,params,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,201,"添加缴费订单成功");
		})
	}
);

//获取缴费订单信息
router.get("/order",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
		if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		powerService.getOrderList(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取缴费订单列表成功");
			})
	}
);

// 改变电费订单状态
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
		powerService.updateOrderState(req.params.id,req.body.buildingId,req.body.roomId,req.body.payBalance,req.body.orderState,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"更新订单状态成功");
		})
	}
);

// 获取宿舍电费列表
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
		powerService.getAllDormitoryPower(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取宿舍电费列表成功");
			})
	}
);

// 改变电费订单状态
router.put("/recharge/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"id不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		powerService.updateBalance({
			"id":req.params.id,
			"payBalance":req.body.payBalance
		},function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"手动缴费成功");
		})
	}
);

// 查询宿舍订单
router.get("/order/:id",
	// 参数验证
	function(req,res,next) {
		if(!req.params.id) {
			return res.sendResult(null,400,"宿舍id不能为空");
		}
		next();
	},
	function(req,res,next) {
		powerService.showPaylist(req.params.id,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取宿舍订单成功");
		});
	}
);

module.exports = router;