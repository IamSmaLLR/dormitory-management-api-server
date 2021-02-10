module.exports = function(db,callback){
	// 用户模型
	db.define("BuildingModel",{
		id : {type: 'serial', key: true},
		buildingId : String,
		identify : [1,2], //1-男生宿舍，2-女生宿舍
		buildingHeight : Number,
		roomNums : Number,
		buildingDesc : String,
		BAName : String,
		BATel : String
	},{
		table : "building"
	});
	return callback();
}