var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));
var Password = require("node-php-password");
var xlsx = require('node-xlsx').default;


/**
 * 获取所有学生用户
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"query" : 关键词查询,
		"sex" : 性别查询,
		"dmtyId" : 楼栋/宿舍查询,
		"state" : 状态,
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param  {Function} cb         回调函数
 */

module.exports.getAllStudents = function(conditions,cb) {

	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");
	
	obj = {
		"id" : conditions["query"],
		"sex" : conditions["sex"],
		"buildingId" : conditions["buildingId"],
		"roomId" : conditions["roomId"],
		"state" : conditions["state"]
		}
	// 通过关键词获取学生数量
	UserManageDAO.countByObj(obj,function(err,count) {
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		UserManageDAO.findByObj(obj,offset,limit,function(err,result){
			var Students = [];
			for(idx in result) {
				var student = result[idx];
				if(student.state == 1){
					state = true
				}else{
					state = false
				}
				Students.push({
					"userid":student.userid,
					"username":student.username,
					"sex":student.sex,
					"collegeMajor":student.collegeMajor,
					"buildingId":student.buildingId,
					"roomId":student.roomId,
					"state":state
				});
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["users"] = Students;
			cb(err,resultData);
		});
	});
}

/**
 * 通过用户ID 获取学生信息
 * 
 * @param  {[type]}   id 用户ID
 * @param  {Function} cb 回调函数
 */
module.exports.getStu = function(id,cb) {
	UserManageDAO.show(id,function(err,result){
		if(err) return cb(err);
		if(!result) return cb("该学生不存在");
		cb(
			null,
			{
				"userid":result.userid,
				"username":result.username
			}
		);
	});
}

/**
 * 修改学生用户信息
 *
 * @param  {[type]}   sex  		   用户性别
 * @param  {[type]}   collegeMajor 用户学院/专业
 * @param  {Function} cb         回调函数
 */
module.exports.updateStuInfo = function(userid,sex,collegeMajor,cb) {
	UserManageDAO.update({"userid":userid,"sex":sex,"collegeMajor":collegeMajor},function(error,res) {
		if(error) return cb("修改学生用户信息失败");
		cb(null,"修改学生用户信息成功");
	});
}

/**
 * 通过学号 ID 进行删除操作
 * 
 * @param  {[type]}   id 学号ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteStu = function(id,cb) {
	UserManageDAO.destroy(id,function(err){
		if(err) return cb("删除用户失败");
		cb(null);
	});
}

/**
 * 通过学号ID数组进行批量删除操作
 * 
 * @param  {[type]}   idArr 学号ID数组
 * @param  {Function} cb  回调函数
 */
module.exports.deleteStus = async function(idArr,cb) {
	for(idx in idArr){
		var userid = idArr[idx];
		await UserManageDAO.destroy(userid,function(err){
			if(err) return cb("删除用户失败");
		});
	}
	cb(null)
}

/**
 * 创建学生用户
 * 
 * @param  {[type]}   student 学生用户
 * @param  {Function} cb      回调函数
 */
module.exports.createStu = function(student,cb) {
	UserManageDAO.findOne({"userid":student.userid},function(err,result){
		if(!result){
			UserManageDAO.create({
				"userid":student.userid,
				"username":student.username,
				"password":Password.hash('123456'), //默认密码123456
				"sex":student.sex,
				"collegeMajor":student.collegeMajor,
				"state":0,
				"isAdmin":0,
				"avatar":"http://127.0.0.1:8888/public/assets/avatar.png"
			},function(err,result){
				if(err) return cb("添加学生用户失败~");
				cb(null,"添加学生用户成功！");
			});
		}else{
			return cb("该学号已存在")
		}
	})
}

/**
 * 批量创建学生用户
 * 
 * @param  {[type]}   xlsxPath   xlsx存储地址
 * @param  {Function} cb     回调函数
 */

module.exports.createStus = function(xlsxPath,cb) {
		const workSheetsFromFile = xlsx.parse(xlsxPath);
		var studentArr = workSheetsFromFile[0].data
		var students = []
		for(var i=1;i<studentArr.length;i++){
			students.push(studentArr[i])
		}
		var errList = []
		var resList = []
		for(item of students){
			const rawData = {
				userid : item[0],
				username : item[1],
				sex : item[2]==='男'? 1:2,
				collegeMajor : item[3],
				password:Password.hash('123456'), //默认密码123456
				state:0,
				isAdmin:0,
				avatar:"http://127.0.0.1:8888/public/assets/avatar.png"
			}
			const rawid = {
				userid : item[0]
			}
			errors = ''
			if(!rawData.userid){
				errors += '学号不能为空/'
			}
			if(!rawData.username){
				errors += rawData.userid + '姓名不能为空/'
			}
			if(!rawData.sex){
				errors += rawData.userid + '性别不能为空/'
			}
			if(!rawData.collegeMajor){
				errors += rawData.userid + '学院、专业不能为空/'
			}
			if(errors!==''){
				errList.push(errors)
			} else {
				resList.push(rawData)
			}
		}
		if(errList.length){
			return cb("每个字段项不能为空请注意格式")
		}
		UserManageDAO.create(resList,function(err,result){
			if(err) return cb("重复用户导入，请检查数据")
			cb(null,"解析成功")
		})
}