/* 
*   Controller 基类
*   所有Node编写的业务处理控制类都集成此基类，路由的配置直接配置在roterConfig.json中
*   功能：
*       基类主要实现了数据基础的增删改查的基本操作，如无特殊业务逻辑子类已无需再
*   重新实现，如有特殊的业务可以重写几个方法
*/
var parse = require('./utilities/transferUtility');
var utility = require('./utilities/utilities')
var rcp = require('./utilities/requestParser');
var apiResult = require('./result/actionResult');
class controllerBase {
    constructor(application, dao) {
        this.app = application;
        ///需要数据访问实体的实例
        this._daoModel = dao;
        this.initializeRouter(this);
    }
    /*
    返回数据结果
    */
    responseResult(req,res,result)
    {
        console.log(result);
        result=result||{};
        if (result.successed && req.security){
            result.disableControl = req.security.disableControl
            result.unvisibleControl = req.security.unvisibleControl;
        }
        res.json(result);
    }
    /*
    * 初始化路由处理器(空方法,待继承的子类去实现)
    * 除了在routerConfig中配置的路由以外，继承的子类可以重写实现此方法来
    * 继续配置你的路由
    */
    initializeRouter(instance) { }
    /*
    *  数据加载之前的动作
    *  子类可以重写该方法
    */
    beforeAccessDB(req, sql, sqlParams, type) {
        return Promise.resolve({ sql: sql, sqlParams: sqlParams,canceled:false });
    }
    /*
    *  数据发送到客户端之前的动作
    *  子类可以重写该方法
    */
    beforeResponseData(req, res, result, type) {
        return Promise.resolve({ render: true, result: result });
    }
    /*
    * 获取查询列表记录的方法
    */
    *getListData(req, dataKey,configFile=0) {
        req.dataKey = dataKey;
        rcp.getListInfo(req,configFile);
        ////直接操作数据库之前，可由子类再次Handler
        let beforeData =yield this.beforeAccessDB(req, req.listSql, req.sqlParams, "list");
        ////如果返回Null,则表示不加载数据了
        if (beforeData.canceled!=null && beforeData.canceled==true) return {successed:false,errorcode:1,errormessage:"canceled"};
        ////操作数据库
        let result = yield this._daoModel.loadData(beforeData.sql, beforeData.sqlParams);
        if (result.rows != null) {
            ///将从数据库中获得的结果集根据dataconfig中的配置进行映射转换
            let resultItem=yield parse.transferName2Mapping(result.rows[0], req.fieldsMapping)
            let outputData = { "successed":true,page:req.page,rows:resultItem.data };
            if (req.sqltype == "proc") {
                req.sqlOutParams.forEach(function (item, index) {
                    outputData[item] = result.rows[1][0][item];
                });
            } else {
                outputData.total = result.rows[1][0].total;
            }
            return outputData;
            
        } 
        return { "successed": false,errorcode:-1,total: 0, rows:[]};
    }
    /*
    * 获取详细记录的方法
    */
    *getDataById(req, dataKey,sqlCommand) {
        req.dataKey = dataKey;
        rcp.getDetailInfo(req);
        let beforeData =yield this.beforeAccessDB(req, sqlCommand||this._daoModel.getByIdSql, req.params.id, "detail");
        ////如果返回Null,则表示不加载数据了
        if (beforeData.canceled) return {successed:false,errorcode:1,errormessage:"canceled"};

        let result = yield this._daoModel.getBykey(beforeData.sql, beforeData.sqlParams);
        if (result.rows != null && result.rows.length == 1) {
            ///将从数据库中获得的结果集根据dataconfig中的配置进行映射转换
            let resultMapping= yield parse.transferName2Mapping(result.rows, req.fieldsMapping);
            return {successed: true, rows: resultMapping.data[0],id: req.params.id};
        }
        return apiResult.DB_NO_RECORD_FOUND;
    }


    /*
    * 新增实体记录的方法
    */
    *create(req, dataKey,sqlCommand) {
        req.dataKey = dataKey;
        rcp.getDetailInfo(req);
        let resultItem =yield parse.transferMapping2Name(req, req.fieldsMapping, "create");
        let beforeData =yield this.beforeAccessDB(req, this._daoModel.insertSql, resultItem.data, "create");
        ////如果返回Null,则表示不加载数据了
        if (beforeData.canceled) return {successed:false,errorcode:1,errormessage:"canceled"};

        let result =yield this._daoModel.create(beforeData.sql, beforeData.sqlParams)
        let primaryKey;
        if (req.primary)
        {
            if (typeof(req.primary)==="string") primaryKey=beforeData.sqlParams[req.primary];
            if (typeof(req.primary)==="object")
            primaryKey=req.primary.map(element=>{return beforeData.sqlParams[element];});
        }
        return {successed: true, data: resultItem.data,id:primaryKey};
    }
    /*
    * 修改实体记录的方法
    */
    *update(req, dataKey, sqlCommand,id) {
        console.log(sqlCommand)
        req.dataKey = dataKey;
        rcp.getDetailInfo(req);
        ///从Request中获取到用户提交的数据
        let resultItem=yield parse.transferMapping2Name(req, req.fieldsMapping, "update");
        let beforeData =yield this.beforeAccessDB(req, sqlCommand||this._daoModel.updateSql, resultItem.data, "update");
        ////如果返回Null,则表示不加载数据了
        if (beforeData.canceled) return {successed:false,errorcode:1,errormessage:"canceled"};
        let result= yield this._daoModel.update(beforeData.sql, beforeData.sqlParams, req.params.id);
        ///更新成功
        if (result.rows.affectedRows==1) return {successed:true,data:resultItem.data,id: req.params.id};
        ///更新失败
        return apiResult.DB_NO_EFFECTIVE; //{successed:false,errorcode:errorcode.DATABASE_ERROR.NO_RECORD_EFFECTED,data:resultItem.data};
    }

    /*
    * 删除实体记录的方法
    */
    *delete(req, id) {
        //return new Promise((success,failed)=>{
        ///从Request中获取到用户提交的数据
        let beforeData =yield this.beforeAccessDB(req, this._daoModel.deleteSql, id, "delete");

        ////如果返回Null,则表示不加载数据了
        if (beforeData.canceled) return {successed:false,errorcode:1,errormessage:"canceled"};
        let result=yield this._daoModel.delete(beforeData.sql, beforeData.sqlParams)
        if  (result.rows.affectedRows>=1) return {successed: true,id:id};
        ///删除失败
        return apiResult.DB_NO_EFFECTIVE;
        
    }
}
exports = module.exports = controllerBase;