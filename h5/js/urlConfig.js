//var baseUrl = 'http://192.168.0.105:3000/';
var baseUrl = 'http://webapi.huanxinkeji.cn/';
var imageServer = "http://image.huanxinkeji.cn/";
var wechatAuth = "http://webapi.huanxinkeji.cn/wechat/oauth";
var defaultShareImg = location.protocol + "//" + location.host + "/images/share_default.jpg";

var urlConfig = {
	api: {
		////与用户相关的API地址
		user: {
			userInfo: baseUrl + "users",
			address: baseUrl + "users/:id/addresses",
			addressDetail: baseUrl + "users/:id/addresses/:addrid"
		},
		ecommerce: {
			productList: baseUrl + "products",
			productDetail: baseUrl + "products/",
			orderList: baseUrl + "ec/orders",
			makeOrder: baseUrl + "ec/orders"
		},
		bas: {
			districts: baseUrl + "districts",
			wechatPay: baseUrl + "wechat/mp/pay",
			sliders: baseUrl + "sliders",
			shareqr: baseUrl + "shareqr/:serial",
			upload: baseUrl + "fileupload/:filetype"
		},
		activity: {
			actOrders_login: baseUrl + "login",
			actList: baseUrl + "activitys",
			actDetail: baseUrl + "activitys/:id",
			actOrders: baseUrl + "orders",
			actOrders_yhq: baseUrl + "getyhq",
			actOrders_edityhq: baseUrl + "edityhq",
			actTicket: baseUrl + "orders/:id/ticket",
			ticketForOrder: baseUrl + "tickets/:id"
		},
		brh: {
			kollist: baseUrl + "brh/kols",
			login: baseUrl + "brh/login",
			serviceApply: baseUrl + "brh/services/apply",
			myServices: baseUrl + 'brh/services',
			updatePassword: baseUrl + "brh/password",
			applys: baseUrl + "brh/applys",
			medias: baseUrl + "brh/medias",
			media: baseUrl + "brh/medias/:mediano"
		}
	},
	staticfiles: {
		images: {

		},
		json: {

		}
	}
};