module.exports = function(db,callback){
	// 用户模型
	db.define("RentModel",{
		id : {type: 'serial', key: true},
		userid : String,
		username : String,
		goods_id : Number,
		goods_name : String,
		rent_time : Number,
		goods_price : Number,
		submitDate : Number,
		approvalState : [1,2,3,4], //1-待审批，2-已通过，3-已驳回，4-已完成
		approvalDate : Number
	},{
		table : "rentlist"
	});
	return callback();
}