
var attachmentDao = require('../model/bas/attachment')
var utility = require('../core/utilities/utilities');

/*
this provider is test for upload custom 
*/ 
module.exports.afterUpload=function*(fileType,option,formFileds,userInfo)
{
    var attachment = new attachmentDao();
    console.log('start call promise attachment.create');
    var model={
        file_id:option.dealResult.id,
        file_url: option.dealResult.path,
        file_name: option.dealResult.filename,
        file_size: option.dealResult.filesize,
        bus_type:formFileds.bus_type,// attachmentDao.Business.TAOBAO_STORE,
        bus_id:formFileds.data_id,
        file_upload_date:utility.now('yyyy-mm-dd hh:MM:ss'),
        file_creator:option.dealResult.id};
    var result=yield attachment.create(attachment.insertSql,model);
    console.log('finished promise attachment.create');
    if (!result.successed) option.dealResult.result=2;
    return {successed:result.successed,data:option.dealResult};
}