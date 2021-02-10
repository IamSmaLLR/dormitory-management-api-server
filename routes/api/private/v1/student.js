var express = require('express');
var router = express.Router();
var path = require("path");
var stuService = require(path.join(process.cwd(),"/services/StudentService"));

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
		stuService.getAllStudents(
			{
				"query":req.query.query,
				"sex":req.query.sex,
				"buildingId":req.query.buildingId,
				"roomId":req.query.roomId,
				"state":req.query.state,
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
		stuService.getStu(req.params.id,function(err,result){
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
		stuService.updateStuInfo(req.params.id,req.body.sex,req.body.collegeMajor,
			function(err,result) {
				if(err) return res.sendResult(null,400,err);
				res.sendResult(result,200,"修改信息成功");
			})
	}
);

// 删除单个用户信息
router.delete("/:id",
	// 验证参数
	function(req,res,next){
		if(!req.params.id) return res.sendResult(null,400,"userid不能为空");
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
		stuService.deleteStu(req.params.id,function(err){
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除用户成功");
		})
	}
);

// 批量删除用户
router.delete("/",
	// 验证参数
	function(req,res,next){
		if(!req.query) return res.sendResult(null,400,"userid数组不能为空");
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
		stuService.deleteStus(req.query,function(err){
			if(err) return res.sendResult(null,400,err);
			return res.sendResult(null,200,"删除用户成功");
		})
	}
);

//添加单个学生
router.post("/addOne",
	// 验证参数
	function(req,res,next) {
		if(!req.body.userid){
			return res.sendResult(null,400,"学号不能为空");
		}
		if(!req.body.username) {
			return res.sendResult(null,400,"姓名不能为空");
		}
		if(!req.body.sex) {
			return res.sendResult(null,400,"性别不能为空");
		}
		if(!req.body.collegeMajor) {
			return res.sendResult(null,400,"学院/专业不能为空");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next) {
		params = {
			"userid":req.body.userid,
			"username":req.body.username,
			"sex":req.body.sex,
			"collegeMajor":req.body.collegeMajor,
		}
		stuService.createStu(params,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(null,201,"添加学生成功");
		})
	}
);

// 解析xlsx文件批量创建的逻辑
router.post("/addDuo",
	// 验证参数
	function(req,res,next) {
		if(!req.body.xlsxPath){
			return res.sendResult(null,400,"解析文件地址不存在");
		}
		next();
	},
	// 处理业务逻辑
	function(req,res,next){
	var xlsxPath = path.join(process.cwd(),req.body.xlsxPath);
	stuService.createStus(xlsxPath,function(err,result){
		if(err) return res.sendResult(null,400,err);
		res.sendResult(result,201,"已批量创建学生用户")
	})
})
module.exports = router;