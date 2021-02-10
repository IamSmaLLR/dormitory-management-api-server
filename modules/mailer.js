const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

module.exports.postCode = function(email,content,cb){
	const transport = nodemailer.createTransport(smtpTransport({
	    host: 'smtp.163.com', // 服务 用的163邮箱
	    port: 465, // smtp端口 默认无需改动
	    secure: true,
	    auth: {
	      user: 'xxxxxxx@163.com', // 用户名
	      pass: 'xxxxxxxxxx' // SMTP授权码
	    }
	}));
	const emailInfo = {
		from: 'iamsevenlee@163.com', //发件邮箱
		to: email, //收件邮箱
		subject: '验证你的电子邮件', //标题
		html: content //内容
	}
	transport.sendMail(emailInfo,function(err,result){
		if(err) return cb(err);
		transport.close(); //关闭连接
	})
}
