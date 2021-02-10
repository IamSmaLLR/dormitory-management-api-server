module.exports = function(db,callback){
	// 用户模型
	db.define("DormitoryModel",{
		id : {type: 'serial', key: true},
		buildingId : String,
		roomId : String,
		allCapacity : Number,
		idleCapacity : Number,
		accountBalance : Number,
		members : String
	},{
		table : "dormitory"
	});
	return callback();
}