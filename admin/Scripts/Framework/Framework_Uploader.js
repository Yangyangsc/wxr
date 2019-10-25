
function uploader(container, option) {
     var _this = this;
     if ($.isNullOrEmpty(option.fileKey))  option.fileKey = 'litecoder';
     option.imageBase=option.imageBase || urlConfig.base.imageBase;
     option.url=urlConfig.base.ApiRoot+'/fileupload/'+ option.fileKey;
     if (option.multiUpload==null) option.multiUpload=false;
     _this.uploadOption = option;
     _this.uploaderID = container;
     if (option.failFunc==null) option.failFunc = function(error) { return $.messager.alert('错误','文件上传失败:'+error,'error');}
     
     var init= function()
     {
        var bindCtrl = $('#'+container);
        var ctrlType = bindCtrl[0].hasOwnProperty("type")?bindCtrl[0].type:'';
        //if ($.isNullOrEmpty(bindCtrl[0].type) || bindCtrl[0].type!='file') {
        if (ctrlType!='file'){
             _this.uploaderID = container+'_'+Math.ceil(Math.random() * 1000000);
            bindCtrl.parent().append('<div style="display:none"><input type="file" name="'+_this.uploaderID
                                       +'" id="'+_this.uploaderID+'" '+(option.multiUpload?"multiple":"")+'/></div>')
            bindCtrl.bind('click', function () {$('#'+ _this.uploaderID).click() });
        }
        $('#'+ _this.uploaderID).fileupload({
                url: option.url,
                dataType: 'json',
                formData:option.data,
                done: function (e, data) {
                    var retValue = data.result[0];
                    ///文件上传失败
                    if (!retValue || retValue.result!=0) dataForm.callFunc(option.failFunc,retValue)
                    if (option.refControl){
                        if (option.refControl.contentControl){
                            var input = $('#'+option.refControl.contentControl);
                            if (input) {
                                if (!option.multiUpload)
                                    input.val(retValue.path);
                                else{
                                     var fileValue  = input.val()+','+retValue.path;
                                     if ($.startWith(fileValue,','))
                                        input.val(fileValue.substr(1));
                                     else
                                        input.val(fileValue);
                                }
                            }
                        }
                        if (option.refControl.imageControl){
                            var image = $('#'+option.refControl.imageControl);
                            if (image) image.attr('src',option.imageBase+retValue.path);
                        }
                    }
                    dataForm.callFunc(option.successFunc,retValue)
                },
                progressall: option.progressFunc
                //function (e, data) {
                //     var progress = parseInt(data.loaded / data.total * 100, 10);
                //     $('#progress .progress-bar').css(
                //         'width',
                //         progress + '%'
                //     );
                // }
            });
     }
     ///初始化
     init();
}