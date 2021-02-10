module.exports = function(db,callback){
	// 用户模型
	db.define("NoticeModel",{
		id : {type: 'serial', key: true},
		title : String,
		content : String,
		date : Number
	},{
		table : "noticelist"
	});
	return callback();
}