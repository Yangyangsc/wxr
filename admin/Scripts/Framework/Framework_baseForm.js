var dataForm ={
    ////执行动作函数
    doAction: function (actionoption) {
        var methodFunc = {
            get:dataForm.getAction,
            post:dataForm.postAction,
            put:dataForm.putAction,
            delete:dataForm.deleteAction
        }
        if (!actionoption.method) actionoption.method = "get";
        var funcPoint = methodFunc[actionoption.method.toLowerCase()];
        if (!funcPoint) return;
        funcPoint(actionoption,this);
    },

    ///Post方式
    postAction: function (bindoption,instance) {
        var _self =instance || this;
        if (!bindoption.form) bindoption.form = $('#aspnetForm');
        bindoption.prompt =bindoption.prompt || true;
        if (bindoption.confirm) {
             _self.promptThenCallFunc({prompt:'confirm',title:'提示',message:bindoption.confirmMessage || '是否确认执行此操作?',
                            okFunc:_self.invokeRESTFul,
                            okParam:{func:ApiCaller.Post,param:bindoption}});
        }
        else
            _self.invokeRESTFul({func:ApiCaller.Post,param:bindoption});
        
    },
    ///PUT方式
    putAction: function (bindoption,instance) {
         var _self =instance || this;
        if (bindoption.confirm) {
               _self.promptThenCallFunc({prompt:'confirm',title:'提示',message:bindoption.confirmMessage || '确认更新数据?',
                            okFunc:_self.invokeRESTFul,
                            okParam:{func:ApiCaller.Put,param:bindoption}});
        }
        else
            _self.invokeRESTFul({func:ApiCaller.Put,param:bindoption});
        
    },
    ///通过Get方式调用Action
    getAction: function (bindoption,instance) {
         var _self =instance || this;
        if (bindoption.confirm) {
            _self.promptThenCallFunc({prompt:'confirm',title:'提示',message: bindoption.confirmMessage || '是否确认执行此操作?',
                            okFunc:_self.invokeRESTFul,
                            okParam:{func:ApiCaller.Get,param:bindoption}});
        }
        else
            _self.invokeRESTFul({func:ApiCaller.Get,param:bindoption});
        
    },
    ///通过DELET方式调用接口
    deleteAction: function (bindoption,instance) {
        var _self =instance || this;
        bindoption.failMessage=bindoption.failMessage|| '删除数据失败';
        if (bindoption.confirm) {
            _self.promptThenCallFunc({prompt:'confirm',title:'删除确认',message:'确认删除当前数据?',
                            okFunc:_self.invokeRESTFul,
                            okParam:{func:ApiCaller.Delete,param:bindoption}});
        }
        else
           _self.invokeRESTFul({func:ApiCaller.Delete,param:bindoption});
        
    },
    ///删除记录
    deleteRecord: function (deleteOption) {
        this.deleteAction(deleteOption);
    },
    ////调用Api
    ////Func : 具体用什么方法调用
    invokeRESTFul:function(invokeOption)
    {
         var func = invokeOption.func;
        var bindoption = invokeOption.param;
        if (!dataForm.isFunc(func) || !bindoption) return false;
        
        ///调用之前是否有啥要处理
        if (bindoption.beforeFunc != null && typeof (bindoption.beforeFunc) == 'function') 
            if (!bindoption.beforeFunc(bindoption)) return;
        ///正式调用接口
        func({url:bindoption.url,data:bindoption.data,
                successFunc:function (json) {
                            if (bindoption.prompt) {
                                dataForm.promptThenCallFunc({title:'成功',message:bindoption.successMessage || '数据处理成功',okFunc: bindoption.successFunc,okParam:json});
                            }
                            else
                                dataForm.callFunc(bindoption.successFunc,json);
                        },
                failFunc:function(error){
                            dataForm.promptThenCallFunc({title:'失败',message:bindoption.failMessage || '数据处理失败',icon:'error',okFunc: bindoption.failFunc,okParam:error});
                        }
        });
    },
    ///新增详细记录
    addRecord: function (addOption) {
        var random = Math.random();
        var joint = addOption.url.indexOf('?') > 0 ? '&' : '?';
        addOption.url = addOption.url + joint + 'ActionType=addnew&random=' + random;
        if (addOption.beforeFunc != null && typeof (addOption.beforeFunc) == 'function') {
            if (!addOption.beforeFunc(addOption)) return;
        }
        this.openModal(addOption);
    },
    ///编辑记录
    editRecord: function (editOption) {
        var random = Math.random();
        var joint = editOption.url.indexOf('?') > 0 ? '&' : '?';
        editOption.url = editOption.url + joint + 'ActionType=edit&key=' + editOption.key + '&random=' + random;
        if (editOption.beforeFunc != null && typeof (editOption.beforeFunc) == 'function') {
            if (!editOption.beforeFunc(addOption)) return;
        }
        this.openModal(editOption);
    },
    ///查看记录,不允许编辑
    viewRecord: function (editOption) {
        var random = Math.random();
        var joint = editOption.url.indexOf('?') > 0 ? '&' : '?';
        editOption.url = editOption.url + joint + 'ActionType=view&key=' + editOption.key + '&random=' + random;
        if (editOption.beforeFunc != null && typeof (editOption.beforeFunc) == 'function') {
            if (!editOption.beforeFunc(addOption)) return;
        }
        this.openModal(editOption);
    },
    ///打开记录新增的详细页面
    openModal: function (detailOption) {
        dialogHelper.showModal(detailOption);
    },
    ///先提示用户，再执行方法
    promptThenCallFunc:function(option) {
        _self = this;
        option.prompt = option.prompt || 'alert';
        option.title = option.title || '提示';
        option.message = option.message || '请带上友好提示信息';
        option.icon = option.icon || 'info';    ///error
        option.fn=function(r){
                if (option.prompt=='confirm'){
                    if (r) {
                        if (_self.isFunc(option.okFunc))
                            _self.callFunc(option.okFunc,option.okParam)
                        else
                            _self.callFunc(option.cancelFunc,option.cancelParam)
                    }
                }
                else
                    _self.callFunc(option.okFunc,option.okParam);
        };
        var messageFunc = $.messager[option.prompt.toLowerCase()];
        switch(option.prompt.toLowerCase())
        {
            case "alert": return messageFunc(option.title, option.message, option.icon,option.fn);
            case "prompt":
            case "confirm": return messageFunc(option.title, option.message, option.fn);
            case "show" : return  messageFunc({title:option.title,msg:option.message,showType:option.showType || 'slide'});
        }
        
    },
    isFunc:function(func){
        return func && typeof(func)==="function";
    },
    ///调用函数
    callFunc:function(func,param){
        if (dataForm.isFunc(func))  return func(param);

    }

}

