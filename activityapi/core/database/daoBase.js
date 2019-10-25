var DB = require('./mysqlbase');
class dalBase{
    constructor(){
        this.database = new DB();
    }
    
    loadData(sqlString, parameters){
        return this.database.executeSql(sqlString, parameters);
    }
}
exports=module.exports = dalBase;
