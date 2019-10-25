/*
后台微信支付的相关代码
*/
var wechatApi = require('./WechatApi');
var qs = require('qs');
var crypto = require('crypto');
var rpc = require('../core/rpc/rpcUtility');

class WechatPay extends wechatApi{
    constructor(req,res){
        super(req,res);
    }
    //取得随机数
    getNonceStr() {  return Math.random().toString(36).substr(2, 15);};
    //形成key=value&key1=value&...的字符串
    getRawString(args) {
      var keys = Object.keys(args);
      keys = keys.sort()
      var newArgs = {};
      keys.forEach(function (key) {
        newArgs[key] = args[key];
      });
      var string = '';
      for (var k in newArgs) {
        //如果参数的值为空不参与签名
        if (newArgs[k]) {
            string += '&' + k + '=' + newArgs[k];
        }
      }
      string = string.substr(1);
      return string;
    }
    //形成向微信服务器请求的xml格式数据
    getXmlFormat(_array) {
        var keys = Object.keys(_array);
        var _xmlData = '<xml>';
        keys.forEach(function(key) {
            _xmlData += '<' + key + '>' + _array[key] + '</' + key + '>';
        });

        //取得签名加密字符串
        var    _paySign = paySign(_array);        
        _xmlData += '<sign>' + _paySign + '</sign>';
        _xmlData += '</xml>';
        // console.log('xml data ===', _xmlData);
        return _xmlData;
    }
    //取得微信端返回来的xml标签里的value
    getXMLNodeValue(node_name, xml, flag=false){
        var _reNodeValue = '';
        var tmp = xml.split('<' + node_name + '>');
        if (tmp) {
            var _tmp = tmp[1].split('</' + node_name + '>')[0];
            if (!flag) {
                var _tmp1 = _tmp.split('[');
                _reNodeValue = _tmp1[2].split(']')[0]
            } else {
                _reNodeValue = _tmp;
            }    
        }
        return _reNodeValue;
    }
    //响应网页端请求的签名数据
    reSignature(_url, _ticket) {
        var timestamp = this.getTimeStamp();
        var noncestr = this.getNonceStr();
        var str = 'jsapi_ticket=' + _ticket + '&noncestr='+ noncestr + '&timestamp=' + timestamp + '&url=' + _url;
        console.log(str);
        var signature = crypto.createHash('sha1').update(str).digest('hex');
        console.log('jsapi signature is ', signature);
        var _dataSign = { 
                            appId: this.config.appId,
                            timestamp: timestamp,
                            nonceStr: noncestr,
                            signature: signature
                        };
        return _dataSign;
    }

    //根据数据格式需求生成签名
    paySign(_array) {
        _array = _array || {};
        //拼接成微信服务器所需字符格式
        var string = this.getRawString(_array);
        //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
        var key = this.config.api_key;
        string = string + '&key='+key;  
         var cryString = crypto.createHash('md5').update(string,'utf8').digest('hex');
        //对加密后签名转化为大写
        return cryString.toUpperCase();
    }

  
    // 取得微信支付返回的数据，用于生成二维码或是前端js支付数据
    *getWeChatPayid(_spbillId, _traType, _openid, _out_trade_no, _attach, _product_id, _body, _cb, _cbfail){
        console.log('客户端请求ip:', _spbillId);
        //取得需向微信服务器发送的数据,且通过该数据组进行xml与sign数据生成
        //数据集必须包含所有微信端所必须的字段数据信息
        var _preArray = {
            appid: this.config.appID,
            mch_id: this.config.mch_id, //微信支付商户号
            notify_url: this.config.notify_url, //回调函数
            out_trade_no: _out_trade_no || ('pro_wxpay' + Math.floor((Math.random()*1000)+1)), //订单号
            attach: _attach || '支付功能', //附加信息内容
            product_id: _product_id || 'wills001', // 商品ID, 若trade_type=NATIVE，此参数必传
            body: _body || 'H5端支付功能开发', // 支付内容
            openid: _openid || '',
            spbill_create_ip: _spbillId || '127.0.0.1', //客户端ip
            time_stamp: this.getTimeStamp(), 
            trade_type: _traType || 'JSAPI', 
            total_fee: 1, //支付金额，单位分
            nonce_str: this.getNonceStr(),
            limit_pay: this.config.limit_pay, //是否支付信用卡支付
        };
        //取得xml请求数据体
        var _formData = this.getXmlFormat(_preArray);
        //向微信服务端请求支付
        var prepayData = yield rpc.request({
            url : this.config.prepay_id_url,
            method : 'POST',
            body : _formData
        });
        //返回来的XML数据
        var _reBodyXml = prepayData.toString('uft-8');
        console.log('return xml data ==', _reBodyXml);
        //取得return_code进行成功与否判断
        var _reCode = this.getXMLNodeValue('return_code', _reBodyXml, false);
        console.log('return code', _reCode);
        var rePrepayId = {
            prepay_id: '',
            code_url: '',
            timestamp: _preArray.time_stamp,
            nonceStr: _preArray.nonce_str,
            paySign: '',
            msg: '请求prepay_id'
        };
        if (_reCode=='SUCCESS') {
            var _resultCode = this.getXMLNodeValue('result_code', _reBodyXml, false);
            if (_resultCode=='SUCCESS') {
                //成功时返回prepay_id与二维码
                rePrepayId.prepay_id = this.getXMLNodeValue('prepay_id', _reBodyXml, false);
                rePrepayId.msg = '成功取得prepay_id';
                if (_preArray.trade_type == 'NATIVE') {
                    rePrepayId.code_url = this.getXMLNodeValue('code_url', _reBodyXml, false);
                } 
                else if(_preArray.trade_type == 'JSAPI') {
                        var _signPara = {
                                appId: this.config.appId,
                                timeStamp: _preArray.time_stamp,
                                nonceStr: _preArray.nonce_str,
                                package: 'prepay_id=' + rePrepayId.prepay_id,
                                signType: 'MD5'
                            };
                        rePrepayId.paySign = this.paySign(_signPara);
                }                          
            } else {
                rePrepayId.msg = getXMLNodeValue('err_code_des', _reBodyXml, false);
                return Promise.reject(rePrepayId);
            }
            return Promise.resolve(rePrepayId);
        } //else if (_reCode=='FAIL') {
        rePrepayId.msg = this.getXMLNodeValue('return_msg', _reBodyXml, false);
        return Promise.reject(rePrepayId);
       //}
       // _formData = null;
    }
    /*
    支付完毕回调的处理函数
    */
    *PayCallback(_req) {
        //返回来的XML数据，现在是以express4.X的返回数据为例子，实际中要以实际数据进行解析
        var _reBody = _req.body || _req.rawBody;
        var _payInfo = _reBody.xml;
        if (_payInfo.return_code == 'SUCCESS') {
            console.log('用户成功支付金额：', _payInfo.cash_fee);
            console.log('用户openid：', _payInfo.openid);
        } else {
            console.log('用户支付失败：', _payInfo.return_msg);
            console.log('用户openid：', _payInfo.openid);
        }
        var  xml = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';

        return Promise.resolve(xml);
    }

}
exports = module.exports = WechatPay