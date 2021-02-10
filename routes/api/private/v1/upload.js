var express = require('express');
var router = express.Router();
var path = require("path");

var fs = require('fs');
// 一个有关文件上传的中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。
var multer  = require('multer');
// 临时上传目录
var upload = multer({ dest: 'tmp_uploads/' });
var upload_config = require('config').get("upload_config");

var homeService = require(path.join(process.cwd(),"/services/HomeService"));
var rentService = require(path.join(process.cwd(),"/services/RentService"));

// 提供文件上传服务
router.post("/",upload.single('file'),function(req,res,next) {
	var fileExtArray = req.file.originalname.split(".");
	var ext = fileExtArray[fileExtArray.length - 1];
	var targetPath = req.file.path + "." + ext;
	var sourcePath = process.cwd() + '/' + req.file.path;
	var destinationPath = process.cwd() + '/' + targetPath;
    fs.rename(sourcePath,destinationPath,function(err){
		if(err) {
			return res.sendResult(null,400,"添加文件失败");
		}
		res.sendResult({"tmp_path":targetPath,"url":upload_config.get("baseURL") + "/" + targetPath},200,"上传成功");
	})
});

// 头像上传的逻辑
router.put("/avatar",function(req,res,next){
	var sourcePath = process.cwd() + '/' + req.body.avatarPath
	var targetPath = process.cwd() + "/uploads/avatarspics/" + req.body.avatarPath.split('/')[1]
	fs.rename(sourcePath,targetPath,function(err){
		if(err) {
			return res.sendResult(null,400,"上传头像失败")
		}
		path = upload_config.get("baseURL") + "/uploads/avatarspics/" + req.body.avatarPath.split('/')[1]
		homeService.updateAvatar(req.userInfo,path,function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"修改头像成功");
		})
	})
})

// 租赁物品图片上传的逻辑
router.put("/goods",function(req,res,next){
	var sourcePath = process.cwd() + '/' + req.body.goods_picture
	var targetPath = process.cwd() + "/uploads/goodspics/" + req.body.goods_picture.split('/')[1]
	fs.rename(sourcePath,targetPath,function(err){
		if(err) {
			return res.sendResult(null,400,"上传商品图片失败")
		}
		path = upload_config.get("baseURL") + "/uploads/goodspics/" + req.body.goods_picture.split('/')[1]
		rentService.createGoods({
			"goods_name":req.body.goods_name,
			"goods_price":req.body.goods_price,
			"goods_number":req.body.goods_number,
			"goods_picture":path,
			"goods_desc":req.body.goods_desc
		},function(err,result){
			if(err) return res.sendResult(null,400,err);
			res.sendResult(result,200,"上传商品成功");
		})
	})
})
module.exports = router;