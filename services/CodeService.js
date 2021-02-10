var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));
var mailer = require(path.join(process.cwd(),"modules/mailer"));
var CodeManageDAO = require(path.join(process.cwd(),"dao/CodeManageDAO"));
var UserManageDAO = require(path.join(process.cwd(),"dao/UserManageDAO"));

function randomFns () {
	let code = "";
	for(let i=0;i<6;i++){
		code += parseInt(Math.random()*10)
	}
	return code;
}

module.exports.changeContactInfo = function(userInfo,type,email,cb){
	let userid = userInfo.uid
	let code = randomFns();
	let content = `
            <p>您好！</p>
            <p>您正在修改${userid}用户的联系方式</p>
            <p>您的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
            <p>***该验证码1分钟内有效***</p>`;
	CodeManageDAO.destroy(userid,type,function(err,result){
		UserManageDAO.findOne({"userid":userid},async function(err,result){
			if(result.email){
				mailer.postCode(result.email,content,function(err,result){
					if(err) return cb("发送验证码错误")
					cb(null,"验证码发送成功")
				})
				await CodeManageDAO.create({"userid":userid,"type":type,"code":code},function(err,result){})
				setTimeout(async function(){
					await CodeManageDAO.destroy(userid,type,function(err,result){})
				},1000*60)
			}else{
				mailer.postCode(email,content,function(err,result){
					if(err) return cb(err)
					cb("验证码发送成功")
				})
				await CodeManageDAO.create({"userid":userid,"type":type,"code":code},function(err,result){})
				setTimeout(async function(){
					await CodeManageDAO.destroy(userid,type,function(err,result){})
				},1000*60)
			}
		})
	})
}


module.exports.changePassword = function(userInfo,type,cb){
	let userid = userInfo.uid
	let code = randomFns();
	let content = `
            <p>您好！</p>
            <p>您正在修改${userid}用户的密码，请谨慎对待，如若不是您本人，请勿理会</p>
            <p>您的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
            <p>***该验证码1分钟内有效***</p>`;
	CodeManageDAO.destroy(userid,type,function(err,result){
		UserManageDAO.findOne({"userid":userid},async function(err,result){
			if(result.email){
				mailer.postCode(result.email,content,function(err,result){
					if(err) return cb("发送验证码错误")
					cb(null,"验证码发送成功")
				})
				await CodeManageDAO.create({"userid":userid,"type":type,"code":code},function(err,result){})
				setTimeout(async function(){
					await CodeManageDAO.destroy(userid,type,function(err,result){})
				},1000*60)
			}else{
				return cb("您未设置邮箱，请先修改您的邮箱！")
			}
		})
	})
}