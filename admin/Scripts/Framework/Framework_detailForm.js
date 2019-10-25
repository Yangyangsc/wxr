function detailForm(_form, option) {
    var _this = this;
    var mainform = _form != null ? _form : 'aspnetForm';
    var _binditem = null;
    var _itemkey = option.itemkey;  //null
    var _actiontype = option.actiontype; //'addnew';
    _this.detailOption = option;

    var init = function () {
        if (_itemkey == null || _itemkey == '') _itemkey = $.getUrlParam('key');
        if (_actiontype == null || _actiontype == '') _actiontype = $.getUrlParam('actiontype');
        if (_actiontype == null || _actiontype == '') _actiontype = 'addnew';
        _actiontype = _actiontype.toLowerCase();
        ///注册保存按钮
        if (option.saveOption) {
            if (option.saveOption.button)
                $(option.saveOption.button).bind('click', function () { _this.save(option.saveOption) });
        }
        ///绑定删除按钮
        if (option.deleteOption && option.deleteOption.button && _actiontype == 'edit') {
            $(option.deleteOption.button).bind('click', function () { _this.deleteRecord(null, option.deleteOption) });
        }
    };
    ///当前界面上绑定的对象
    this.getCurrentItems = function () {
        return _binditem;
    };
    ///当前界面上对象的Key值
    this.getCurrentKey = function () {
        return _itemkey;
    }
    ///当前操作模式
    this.getCurrentAction = function () {
        return _actiontype;
    }
    ///列表查询
    this.bindForm = function (option) {
        if (_this.getCurrentAction() == 'addnew'){
            return dataForm.callFunc(option==null?_this.detailOption.initForm:option.initForm);
        }
        var orgoptions = option != null ? option : _this.detailOption.bindOption;
        var bindoption = {};
        $.extend(bindoption, orgoptions);
        bindoption.waitingMessage=bindoption.waitingMessage || "数据加载中...";
        var searchParam = window.location.search;
        if (searchParam.length > 0) searchParam = searchParam.substr(1);
        if (bindoption.beforeFunc && typeof (bindoption.beforeFunc) == 'function') {
            if (!bindoption.beforeFunc()) return;
        }
        bindoption.url+=($.endsWith(bindoption.url,'/')?'':'/')+this.getCurrentKey()+'?'+searchParam;
        var afterLoaded = bindoption.successFunc;
        bindoption.successFunc = function (jsonObj) {
                var json = jsonObj;
                if (jsonObj.rows != null) json = jsonObj.rows;
                $('#' + mainform).form('load', json);
                // console.log("json")
                // console.log(JSON.stringify(json));
                _binditem = json;
                if (afterLoaded && typeof (afterLoaded) == 'function') {
                    afterLoaded(json);
                }
        }
        if (bindoption.failFunc==null)
            bindoption.failFunc = function(err) { $.messager.alert('失败', '数据加载失败' + err, 'error');}
        ApiCaller.Get(bindoption);
    };

    ///新建记录
    this.save = function (option) {
        console.log("saveOption")
        console.log(option)
        var orgoptions = option != null ? option : _this.detailOption.saveOption;
        var saveoption = {};
        $.extend(saveoption, orgoptions);
        ///默认绑定创建后刷新数据
        if (!saveoption.closeFunc) {
            saveoption.closeFunc = function (result) {
                if (result) dialogHelper.closeModal(true);
            }
        }
        var searchParam = window.location.search;
        if (!saveoption.formValidate) saveoption.formValidate = true;
      
        if (saveoption.formValidate) {
            if (!$('#' + mainform).form('validate')) 
                return $.messager.alert('提示', '请完整输入界面中的必填内容并保证输入合法!', 'info');
        }
        ///保存前的验证
        if (saveoption.beforeFunc && typeof (saveoption.beforeFunc) == 'function') {
            if (!saveoption.beforeFunc(saveoption)) return;
        }
        
        var json = $('#' + mainform).serialize();
        console.log("json")
        console.log(JSON.stringify(json));
        saveoption.data= json;
        saveoption.waitingMessage =saveoption.waitingMessage || "数据保存中...";
        

        var afterSaved = saveoption.successFunc;
        saveoption.successFunc = function (result) {
            _binditem = json;
            dataForm.promptThenCallFunc({title:'成功',message:'数据保存成功',okFunc:afterSaved,okParam:result});
        }
        var errFunc =  saveoption.failFunc;
        saveoption.failFunc = function (err) {
              dataForm.promptThenCallFunc({title:'失败',message:'数据保存失败',icon:'error',okFunc:errFunc,okParam:err});
        }
        var apiFunc = null; this.getCurrentAction()=="addnew"?ApiCaller.Post:ApiCaller.Put;
        switch(this.getCurrentAction().toLowerCase())
        {
            case "addnew" : 
                saveoption.url = saveoption.url+searchParam;
                apiFunc = ApiCaller.Post;
                break;
            case "edit":
                saveoption.url = saveoption.url+'/'+this.getCurrentKey()+searchParam;
                apiFunc = ApiCaller.Put;
                break;
        }
        if (apiFunc) apiFunc(saveoption);
    };

    ///删除记录
    this.deleteRecord = function (keyValue, deleteOption) {
        var orgoptions = deleteOption != null ? deleteOption : _this.detailOption.deleteOption;
        var options = {};
        $.extend(options, orgoptions);
        options.key = _this.getCurrentKey();
        ///默认绑定删除后刷新数据
        if (!options.successFunc) {
            options.successFunc = function (result) {
                if (result) dialogHelper.closeModal(true);
            }
        }
        dataForm.deleteRecord(options);
    };
    ///初始化
    init();
}