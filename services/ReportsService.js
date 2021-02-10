var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));

module.exports.getSexNums = function(sex,cb){
	UserManageDAO.countBySex(sex,function(err,result){
		if(err) return cb("查询错误")
		cb(null,result)
	})
}

module.exports.getAssignNums = function(cb){
	UserManageDAO.countAssign(function(err,result){
		if(err) return cb("查询错误")
		cb(null,result)
	})
}

module.exports.getAdjustNums = function(cb){
	UserManageDAO.countAdjust(function(err,result){
		if(err) return cb("查询错误")
		cb(null,result)
	})
}

module.exports.getRepairNums = function(cb){
	UserManageDAO.countRepair(function(err,result){
		if(err) return cb("查询错误")
		cb(null,result)
	})
}

module.exports.getPayNums = function(cb){
	UserManageDAO.countPay(function(err,result){
		if(err) return cb("查询错误")
		cb(null,result)
	})
}

module.exports.getRentNums = function(cb){
	UserManageDAO.countRent(function(err,result){
		if(err) return cb("查询错误")
		cb(null,result)
	})
}