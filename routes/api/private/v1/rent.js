var express = require('express');
var router = express.Router();
var path = require("path");
var rentService = require(path.join(process.cwd(),"/services/RentService"));

// 获取租赁物品列表
router.get("/goods",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
		if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		rentService.getGoodsList(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取租赁物品列表成功");
			})
	}
);

// 获取租赁物品列表
router.get("/allGoods",
	// 验证参数
	function(req,res,next) {
		// 参数验证
		if(!req.query.pagenum || req.query.pagenum <= 0) return res.sendResult(null,400,"pagenum 参数错误");
		if(!req.query.pagesize || req.query.pagesize <= 0) return res.sendResult(null,400,"pagesize 参数错误"); 
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		rentService.getAllGoodsList(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取租赁物品列表成功");
			})
	}
);

// 获取租赁订单列表
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
		rentService.getRentList(
			{
				"query":req.query.query,
				"pagenum":req.query.pagenum,
				"pagesize":req.query.pagesize
			},
			function(err,result){
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"获取租赁订单列表成功");
			})
	}
);

// 获取用户申请调整宿舍单
router.get("/submit",
	//处理业务逻辑
	function(req,res,next) {
		rentService.getSubmitList(req.userInfo,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取用户租赁物品申请单成功");
		});
	}
);

//上传租赁申请
router.post("/apply",
	// 验证参数
	function(req,res,next) {
		if(!req.body.rent_time){
			return res.sendResult(null,400,"租赁时长不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		params = {
			"goods_name":req.body.goods_name,
			"goods_id":req.body.id,
			"rent_time":req.body.rent_time,
			"goods_price":req.body.goods_price,
		}
		rentService.createSubmit(req.userInfo,params,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,201,"宿舍调整申请成功");
		})
	}
);

// 更新租赁物品状态
router.put("/goods/:id/:state",
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
		rentService.updateState(req.params.id,req.params.state,
			function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"更新租赁物品状态成功");
		})
	}
);

router.get("/goods/:id",
	//处理业务逻辑
	function(req,res,next) {
		rentService.getGoodsInfo(req.params.id,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"获取租赁物品信息成功");
		});
	}
);

// 更新租赁物品信息
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
		rentService.updateGoodsInfo({
			"id":req.params.id,
			"goods_name":req.body.goods_name,
			"goods_price":req.body.goods_price,
			"goods_number":req.body.goods_number
		},function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"更新租赁物品信息成功");
		})
	}
);

// 删除租赁物品信息
router.delete("/:id",
	// 验证参数
	function(req,res,next){
		if(!req.params.id) return res.sendResult(null,400,"id不能为空");
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
		rentService.deleteGoods(req.params.id,function(err){
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除租赁物品成功");
		})
	}
);

// 改变租赁订单状态
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
		rentService.updateRentListState(req.params.id,req.params.state,function(err,result) {
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"更改租赁订单状态成功");
		})
	}
);

module.exports = router;