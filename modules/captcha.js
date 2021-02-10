var svgCaptcha = require('svg-captcha')

// 处理验证码逻辑
module.exports.getCaptcha = function(req,res,next){
		var svgConfig = {
			size: 4,// 验证码长度
			ignoreChars: '0o1i', // 验证码字符中排除 0o1i
			noise: 5, // 干扰线条的数量
			height: 40,
			inverse: false,
			fontSize: 40,
			}
		var captcha = svgCaptcha.create(svgConfig)
		res.sendResult(captcha,200,"获取验证码成功");
}
