module.exports = function(db,callback){
	// 用户模型
	db.define("CodeModel",{
		id : {type: 'serial', key: true},
		userid : String,
		type : ['更改联系方式','更改密码'],
		code : Number
	},{
		table : "codelist"
	});
	return callback();
}