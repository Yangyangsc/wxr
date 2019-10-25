var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');
var excelConfig = require('../../excelconfig.json');
var configuration = require("../../configuration.json");
var uuid = require('node-uuid');
var fileBase = require('./fileBase');
var co = require('co');
class ExcelUtility
{
    ///读取Excel的内容
    static readExcel(fileName){
        //读取文件内容
        var obj = xlsx.parse(fileName);//__dirname+'/test.xlsx');
        var excelObj=obj[0].data;
        console.log(excelObj);
        return excelObj;
    }
    ///写Excel文件
    static createExcelBuffer(data,fileName,workSheetName){
        var sheetName = 'sheet1';
        if (workSheetName==null) sheetName=workSheetName;
        var buffer = xlsx.build([{name:'sheet1',data:data}]);
       
        res.set({"Content-type":"application/octet-stream",
                "Content-Disposition":"attachment;filename="+encodeURI(fileName)
        });
         fReadStream = fs.createReadStream(buffer);
         fReadStream.on("data",(chunk) => res.write(chunk,"binary"));
            fReadStream.on("end",function () {
                res.end();
        });
    }
    ///写Excel文件
    static writeExcel(data,workSheetName){
        return new Promise((success,reject)=>{
                var sheetName = 'sheet1';
                if (workSheetName==null) sheetName=workSheetName;
                try{
                    var randomFile = uuid.v4()+'.xlsx';
                    var fileName = path.resolve(configuration.writeFileFolder.excel, randomFile);
                    let _saveDir = path.dirname(fileName);
                    ///创建本地文件夹
                    if (!fs.existsSync(_saveDir)) {
                        if (!fileBase.mkdirsSync(_saveDir)) {
                           reject({ success: false,errorcode:1,errmessage:'create folder failed!' });
                        }
                    };
                    var buffer = xlsx.build([{name:workSheetName,data:data}]);
                    fs.writeFileSync(fileName,buffer,{'flag':'w'});
                    success({successed:true,fileName:randomFile});
                }
                catch(err){
                    reject({successed:false,errorcode:1,errmessage:err})
                }
          })
        
        
    }
    ///导出记录集到Excel，写入
    ///dataRow :记录集
    ///exportConfig : 导出的映射配置,如没有则将dataRow直接导出
    ///workSheetName : 导出的Excel 文件 WorkSheet名
    static recordset2ExcelFile(dataRow,exportConfig){
        return co(function*(){
            var setting = excelConfig[exportConfig];
            var dataBuffer = [];
            var worksheetName = "sheet1";
            var fieldKey=[];
            var titleRow=[];
            if (setting!=null){
                worksheetName = setting.worksheet==null?"sheet1":setting.worksheet;
                ////第一行导出标题行
                setting.columns.forEach((field)=>{
                titleRow.push(field.title);
                fieldKey.push(field.name);
                });
            }
            else if (dataRow.length>0){
                var firstRow=dataRow[0];
                Object.keys(firstRow).forEach(key=>{
                    titleRow.push(key);
                    fieldKey.push(key);
                });
            }
            if (titleRow.length>0){
                dataBuffer.push(titleRow);
                dataRow.forEach((rowItem)=>{
                    var dataRow=[];
                    fieldKey.forEach((field)=>{
                        dataRow.push(rowItem[field]);
                    });
                    dataBuffer.push(dataRow);
                })
            }
           var result= yield ExcelUtility.writeExcel(dataBuffer,worksheetName);
           return result;
        }
        );
    }
}
exports = module.exports=ExcelUtility;