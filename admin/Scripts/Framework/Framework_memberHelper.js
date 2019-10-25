
(function ($) {
    ////绑定会员类型到tagBox上
    $.bindMemberType2TagBox=function (option) {
        ApiCaller.Get({url:'/membertype/simple',successFunc:function(result){
            var jsonArray = [];
            //var firstValue;
            if (option.firstItem){
                jsonArray.push(option.firstItem);
                firstValue = option.firstItem.id;
            } 
            memberType = result.rows;
            memberType.forEach(function(itemData,index){
                //if (firstValue==null) firstValue = itemData.id;
                jsonArray.push({ id: itemData.id, text:itemData.text });
            })
            $('#' +option.tagbox).tagbox({
                valueField:'id',
                textField: 'text',
                limitToList: true,
                prompt: option.prompt,
                data:jsonArray,
                hasDownArrow: true,
                panelHeight: 'auto'
            });
        
        if (option.defaultValue) $('#'+option.combobox).tagbox("setValue",option.defaultValue);
        if (option.successFunc!=null && typeof(option.successFunc)==="function") option.successFunc(result);
        }});
    }
    ////绑定会员类型到combobox上
    $.bindMemberType2Combox=function (option) {
        if (option.multiple==null) option.multiple = true;
        ApiCaller.Get({url:'/membertype/simple',successFunc:function(result){
            var jsonArray = [];
            //var firstValue;
            if (option.firstItem){
                jsonArray.push(option.firstItem);
                firstValue = option.firstItem.id;
            } 
            memberType = result.rows;
            memberType.forEach(function(itemData,index){
                //if (firstValue==null) firstValue = itemData.id;
                jsonArray.push({ id: itemData.id, text:itemData.text });
            })
            $('#' +option.combobox).combobox({
                valueField:'id',
                textField: 'text',
                multiple:option.multiple,
                editable: false,
                data:jsonArray,
                panelHeight: 'auto'
            });
        
        if (option.defaultValue) $('#'+option.combobox).combobox("select",option.defaultValue);
        // else
        //     $('#'+option.combobox).combobox("setValue",firstValue);
        if (option.successFunc!=null && typeof(option.successFunc)==="function") option.successFunc(result);
        }});
    }
    ///根据会员的级别值获取对应的名称
    $.getMemberNameByValue=function(value){
        if (value==0) return '普通用户';
        var nameList=[];
        var memberType = lmh_const.LITECODER_MEMBER;
        memberType.forEach(function(itemData,index){
            if ((value & itemData.value)>0) nameList.push(itemData.text);
        })
        return nameList.join(',');
    }
})(jQuery);


