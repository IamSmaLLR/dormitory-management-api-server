var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));
var NoticeManageDAO = require(path.join(process.cwd(),"dao/NoticeManageDAO"));
var CodeManageDAO = require(path.join(process.cwd(),"dao/CodeManageDAO"));
var Password = require("node-php-password");
var logger = require('../modules/logger').logger();

//获取轮播图图片地址
module.exports.getCarousel = function(cb){
	NoticeManageDAO.findCarousel(function(err,result){
		if(err||!result) return cb("图片获取失败");
		var pics = [];
		for(idx in result) {
			var pic = result[idx];
			pics.push({
				"id":pic.id,
				"picPath":pic.picPath
			});
		}
		cb(null,pics)
	})
}

/**
 * 获取用户信息数据
 * 
 * @param   {Object}   userInfo token中的携带信息
 * @param   {Function} cb       回调函数
 */

module.exports.getUserInfo = function(userInfo,cb) {
	if(!userInfo) return cb("无权限访问");
	uid = userInfo.uid;
	
	UserManageDAO.findOne({"userid":uid},function(err,result) {
		if(err || !result) return cb("用户不存在");
		if(result.collegeMajor !== null){
			 str = result.collegeMajor;
			 college = str.split('/')[0];
			 major = str.split('/')[1];
		}else{
			college = '无',
			major = '无'
		}
		if(result.sex == 1){
			sex = '男'
		}else{
			sex = '女'
		}
		if(result.buildingId == null){
			buildingId = "暂无";
			roomId = "暂无"
		}else{
			buildingId = result.buildingId
			roomId = result.roomId
		}
		cb(null,
			[
                [{ id: 1, label: '姓名', res: result.username },
                { id: 2, label: '学号', res: result.userid },
                { id: 3, label: '性别', res: sex },
                { id: 4, label: '电话', res: result.tel },
                { id: 5, label: '邮箱', res: result.email },
                { id: 6, label: '学院', res: college },
                { id: 7, label: '专业', res: major },
                { id: 8, label: '楼栋号', res: buildingId },
                { id: 9, label: '宿舍号', res: roomId }],
				{ "avatar" : result.avatar},
				{ "isAdmin" : result.isAdmin}
			]
		);
	})
}

/**
 * 修改密码
 * 
 * @param  {[type]}   userid  学号id
 * @param  {[type]}   newpwd  新密码
 * @param  {Function} cb      回调函数
 */
module.exports.updatePassword = function(userInfo,newpwd,code,type,cb) {
	if(!userInfo) return cb("无权限访问");
	uid = userInfo.uid;
	logger.debug('updatepassword => userid:%s,new password:%s',uid,newpwd);
	logger.debug(uid);
	CodeManageDAO.findOne({"userid":uid,"type":type},function(err,result){
		if(result && result.code == code){
			UserManageDAO.findOne({"userid":uid},function(err,result) {
				logger.debug(err);	
				if(err || !result) return cb("用户不存在");
				if(Password.verify(newpwd, result.password)){
					return cb("新旧密码一致不需修改~");
				} else {
					var hashpwd = Password.hash(newpwd);
					UserManageDAO.update({"userid":uid,"password":hashpwd},function(error,res) {
							if(error) return cb("修改密码失败");
							cb(null,"修改密码成功");
					});
				}
			});
		}else{
			return cb("验证码错误！")
		}
	})
}

/**
 * 修改联系方式
 * 
 * @param  {[type]}   userid  学号id
 * @param  {[type]}   newpwd  新密码
 * @param  {Function} cb      回调函数
 */
module.exports.updateContactInfo = function(userInfo,tel,email,code,type,cb) {
	if(!userInfo) return cb("无权限访问");
	uid = userInfo.uid;
	CodeManageDAO.findOne({"userid":uid,"type":type},function(err,result){
		if(result && result.code == code){
			UserManageDAO.update({"userid":uid,"tel":tel,"email":email},function(error,res) {
				if(error) return cb("修改联系方式失败");
				cb(null,"修改联系方式成功");
			});
		}else{
			return cb("验证码错误！")
		}
	})
}

/**
 * 获取所有公告
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param  {Function} cb         回调函数
 */
module.exports.getAllNotices = function(conditions,cb) {

	
	if(!conditions.pagenum) return cb("pagenum 参数不合法");
	if(!conditions.pagesize) return cb("pagesize 参数不合法");


	// 获取公告数量
	NoticeManageDAO.count(function(err,count) {
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);

		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if(offset >= count) {
			offset = count;
		}
		limit = pagesize;

		NoticeManageDAO.find(offset,limit,function(err,result){
			var Notices = [];
			for(idx in result) {
				var notice = result[idx];
				Notices.push({
					"id":notice.id,
					"title":notice.title,
					"content":notice.content,
					"date":notice.date
				});
			}
			var resultData = {};
			resultData["total"] = count;
			resultData["pagenum"] = pagenum;
			resultData["notices"] = Notices;
			cb(err,resultData);
		});
	});
}

/**
 * 创建公告
 * 
 * @param  {[type]}   notice 公告
 * @param  {Function} cb     回调函数
 */
module.exports.createNotice = function(params,cb) {
		NoticeManageDAO.create({
			"title":params.title,
			"content":params.content,
			"date":(new Date().getTime())
		},function(err,result){
			if(err) return cb("添加公告失败~");
			cb(null,"添加公告成功！");
		});
}

/**
 * 通过公告ID 获取公告信息
 * 
 * @param  {[type]}   id 公告ID
 * @param  {Function} cb 回调函数
 */
module.exports.getNotice = function(id,cb) {
	NoticeManageDAO.show(id,function(err,result){
		if(err) return cb(err);
		if(!result) return cb("该公告不存在");
		cb(
			null,
			{
				"id":result.id,
				"title":result.title,
				"content":result.content,
				"date":result.date
			}
		);
	});
}

/**
 * 修改公告标题、内容
 * 
 * @param  {[type]}   title    公告标题
 * @param  {[type]}   content  公告内容
 * @param  {Function} cb       回调函数
 */
module.exports.updateNotice = function(id,title,content,cb) {
	NoticeManageDAO.update({"id":id,"title":title,"content":content},function(error,res) {
		if(error) return cb("修改公告失败");
		cb(null,"修改公告成功");
	});
}

/**
 * 通过公告 ID 进行删除操作
 * 
 * @param  {[type]}   id 公告ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteNotice = function(id,cb) {
	NoticeManageDAO.destroy(id,function(err){
		if(err) return cb("删除公告失败");
		cb(null);
	});
}

/**
 * 修改学生头像信息
 *
 * @param  {[type]}   avatar  	 头像地址
 * @param  {Function} cb         回调函数
 */
module.exports.updateAvatar = function(userInfo,avatar,cb) {
	if(!userInfo) return cb("无权限访问");
	uid = userInfo.uid;
	UserManageDAO.update({"userid":uid,"avatar":avatar},function(error,res) {
		if(error) return cb("修改头像失败");
		cb(null,"修改头像成功");
	});
}