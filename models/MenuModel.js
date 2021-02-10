module.exports = function(db,callback){
	// 用户模型
	db.define("MenuModel",{
		index : {type: 'serial', key: true},
		id : Number,
		authName : String,
		path : String,
		level : Number,
		parent : Number,
		permission : [0,1] //0-学生，1-管理员
	},{
		table : "menulist"
	});
	return callback();
}