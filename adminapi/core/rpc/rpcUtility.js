var soap = require('soap');
var request = require('request')
/*
调用WebService
serviceUrl : asmx?wsdl 结尾
funcName : 调用的方法名称
parameters : 参数 json格式 包住，必须与Serice的方法参数名称一致
返回: [funcName]Result (json 格式)
范例如下
var soap = require('./core/rpc/rpcUtility');
soap.call('http://sdk.zhongguowuxian.com:98/ws/LinkWS.asmx?wsdl','BatchSend',
    {
        CorpID:'调用账号',
        Pwd:'密码',
        Mobile:'13719333408',
        Content:'欢迎加入蓝莓会！',
        Cell:'',
        SendTime:''
    })
    .then(result=>res.json(result))
    .catch(result=>console.log(result));
*/
module.exports.callWebService=function(serviceUrl,funcName,parameters){
    return new Promise((resolve,reject)=>{
        soap.createClient(serviceUrl, function(err, client) {
            if (err) 
                reject(err);
            else
                client[funcName](parameters, function(err, result) {
                    if (err) reject(err);
                    resolve(result);
                    //console.log(result);
                });
        });
    });
}
/*
异步请求远程
*/
module.exports.request = function(opts){
    opts = opts || {};  
    return new Promise(function(resolve, reject){  
        request(opts,function(error, response, body){  
            if (error) {  
                return reject(error);  
            }  
            resolve(body);  
        })           
    })
}