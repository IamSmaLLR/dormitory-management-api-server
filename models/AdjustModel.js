module.exports = function(db,callback){
	// 用户模型
	db.define("AdjustModel",{
		id : {type: 'serial', key: true},
		userid : String,
		reason : String,
		submitDate : Number,
		approvalState : [1,2,3,4], //1-未审批，2-已通过，3-已驳回,4-已调整
		buildingId : String,
		roomId : String,
		approvalDate : Number
	},{
		table : "adjustlist"
	});
	return callback();
}