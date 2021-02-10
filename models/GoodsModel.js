module.exports = function(db,callback){
	// 用户模型
	db.define("GoodsModel",{
		id : {type: 'serial', key: true},
		goods_name : String,
		goods_price : Number,
		goods_number : Number,
		goods_state : [0,1], //0-false,1-true
		goods_picture : String,
		goods_desc : String
	},{
		table : "goodslist"
	});
	return callback();
}