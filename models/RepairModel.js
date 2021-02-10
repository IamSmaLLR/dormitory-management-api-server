module.exports = function(db,callback){
	// 用户模型
	db.define("RepairModel",{
		id : {type: 'serial', key: true},
		userid : String,
		username : String,
		buildingId : String,
		roomId : String,
		tel : String,
		reason : String,
		submitDate : Number,
		approvalState : [1,2,3,4], //1-待审批，2-已通过，3-已驳回，4-已完成
		approvalDate : Number
	},{
		table : "repairlist"
	});
	return callback();
}