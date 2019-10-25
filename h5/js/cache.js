/***
 * 用户存储在本地中的Key枚举
 */
if(typeof(keyEnums) == "undefined") {
	var keyEnums = {};
	keyEnums.USER_UID = "userid";
	keyEnums.USER_INFO = "userinfo";
	keyEnums.CART = "shoppingcart";
};

var cache = {
	/*
	 * 设置购物车内容
	 */
	setCart: function(value) {
		if(typeof value == "string") this._set(keyEnums.CART, value);
		else this._set(keyEnums.CART, JSON.stringify(value));
	},

	/*
	 * 获取购物车内容
	 */
	getCart: function() {
		var data = this._get(keyEnums.CART);
		if(data) return JSON.parse(data);
		return null;
	},

	delCart: function() {
		this._del(keyEnums.CART);
	},
	/*
	 * @description 获取当前用户的ID
	 */
	getUserId: function() {
		return this._get(keyEnums.USER_UID);
	},
	/*
	 * @description 设置当前用户的ID
	 */
	setUserId: function(userUid) {
		this._set(keyEnums.USER_UID, userUid);
	},

	getUserInfo: function() {
		var data = this._get(keyEnums.USER_INFO);
		if(data) return JSON.parse(data);
	},

	setUserInfo: function(value) {
		if(typeof value == "string") this._set(keyEnums.USER_INFO, value);
		else this._set(keyEnums.USER_INFO, JSON.stringify(value));
	},

	// 设置localStorage
	getLocalStorage:function(res){
		const isLogin=localStorage.login_data?true:false
		if(isLogin){
			console.log("1")
		}else{
			window.location.href="/login.html"
		}
	},

	setKeyValue: function(key, value) {
		if(typeof value == "string") this._set(key, value);
		else this._set(key, JSON.stringify(value));
	},
	getValueByKey: function(key) {
		var data = this._get(key);
		if(data) {
			var startStr = data.substring(0, 1);
			if(startStr == '{' || startStr == '[')
				return JSON.parse(data);
			return data;
		}
		return null;
	},
	
	///清除百人会用户本地信息
	clearBrhUser: function() {
		this._del(keyEnums.CART);
	},
	////获取当前登录的用户
	getBrhUser: function() {
		var data = this._get(keyEnums.USER_INFO);
		if(data) return JSON.parse(data);
	},
	///保存登录用户
	setBrhUser: function(value) {
		if(typeof value == "string") this._set(keyEnums.USER_INFO, value);
		else this._set(keyEnums.USER_INFO, JSON.stringify(value));
	},

	
	/**
	 * @description 退出时清空用户信息
	 */
	deleteUserInfo: function() {
		this._del(keyEnums.USER_UID);
		this._del(keyEnums.USER_GRADE);
	},
	_set: function(key, value) {
		if(window.sessionStorage) {
			sessionStorage.setItem(key, value);
		}
	},
	_get: function(key) {
		if(window.sessionStorage) {
			return sessionStorage.getItem(key);
		}
		return null;
	},
	_del: function(key) {
		if(window.sessionStorage) {
			sessionStorage.removeItem(key);
		}
	}
};