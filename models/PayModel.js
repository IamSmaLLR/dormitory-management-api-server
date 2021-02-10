module.exports = function(db,callback){
	// 用户模型
	db.define("PayModel",{
		id : {type: 'serial', key: true},
		userid : String,
		username : String,
		buildingId : String,
		roomId : String,
		payDate : Number,
		payBalance : Number,
		orderState: [1,2,3], //1-待审批，2-已支付，3-取消订单
		payMethod: ["微信支付","支付宝支付"]
	},{
		table : "paylist"
	});
	return callback();
}