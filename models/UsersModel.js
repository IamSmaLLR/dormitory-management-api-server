module.exports = function(db,callback){
	// 用户模型
	db.define("UsersModel",{
		userid : {type: 'text', key: true},
		username : String,
		password : String,
		email : String,
		tel : String,
		sex : [1,2], //1-男 2-女
		collegeMajor : String,
		buildingId : String,
		roomId : String,
		state : [0,1], //0-false 1-true
		isAdmin : [0,1],//0-false，1-true
		avatar : String
	},{
		table : "users"
	});
	return callback();
}