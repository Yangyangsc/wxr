/*
* MySql 封装 （简单，应该尚未完善）
*/
var utility = require('../utilities/utilities'); 
var mysql = require('mysql');
var appsetting = require("../configuration/frameworkConfig");
var apiResult = require('../result/actionResult');
class Database{
    constructor(dbName)
    {
        this.dbname =utility.checkValue(dbName,"dev");
        this.connect = appsetting.getConnection(this.dbname );
        this.pool = mysql.createPool(this.connect);
    }
    /*
    *执行SQL命令
    */
    executeSql(sqlCommand, parameters) {
        return new Promise((success,failed)=>{
            if (this.pool == null)     failed(apiResult.DB_CONNECTED_FAILED);
            ///创建出数据库连接，准备执行
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    console.log("Database Connected Failed :"+ err);
                    return failed(apiResult.DB_CONNECTED_FAILED);
                }
                else{
                    console.log("SqlCommand："+sqlCommand + "\r\n Parameters"+parameters);
                    connection.query(sqlCommand, parameters, function (err, rows, fields) {
                        connection.release();
                        if (err)  
                        {
                            console.log("Database Query Error : "+err);
                            return failed(apiResult.decorateResult(apiResult.DB_EXECUTE_FAILED,{errmessage:err.message}));
                        }
                        return success({successed:true,rows:rows});//,fields:fields});
                    });
                }
            });
        });
    }

    executeProcedure(){}
}
module.exports = Database;