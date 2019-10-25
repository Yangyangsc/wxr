var avtMap;
var map;
var lastMark;
var addressInput;
var myInputValue;
var selectLoc;
var defCenter = null;
var defLoc;
var defLevel = 16;
var hasDefCenter = false;

$(function () {
    if ($.getUrlParam('force') == '1') dialogHelper.closeModal(true);
    selectLoc = null;
    InitEvents();
    avtMap = new AVTMap("mapcontainer", {
        defaultLevel: defLevel,
        disableDoubleClickZoom: true,
        showScale: true,
        showNavigation: true,
        //showMouseLocation：true,
        doubleClick: showInfo,
    });
    map = avtMap.map;
    InitDefaultLocation();
    InitSmartAddressInput();
})

function InitSmartAddressInput() {
    
    //建立一个自动完成的对象
    addressInput = new BMap.Autocomplete({ "input": "suggestId", "location": map });
    addressInput.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        $('#searchResultPanel').innerHTML = str;
    });

    addressInput.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myInputValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        $('#searchResultPanel').innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myInputValue;

        setPlace();
    });
    var inputName = $.getUrlParam('name');
    if (inputName) {
        addressInput.setInputValue(inputName);
    }
}

function setPlace() {
    clearOverlays();    //清除地图上所有覆盖物
    function myFun() {
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        AddOverlay(pp);
        //lastMark = new BMap.Marker(pp);
        //lastMark.addEventListener("dblclick", getAttr);
        //map.addOverlay(lastMark);    //添加标注

        //location = JSON.stringify({ lat: pp.lat, lng: pp.lng });
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myInputValue);
}

function resetSearch() {
    $('#txtLocation').val('');
}

function showInfo(e) {
    AddOverlay(new BMap.Point(e.point.lng, e.point.lat));
    //alert(e.point.lng + ", " + e.point.lat);
}

function setLoction() {
    var text = $('#txtLocation').val();
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(text,
        function (point) {
            if (point) {
                AddOverlay(point);
                //if (lastMark) {
                //    map.clearOverlays();
                //}
                //lastMark = new BMap.Marker(point);
                //lastMark.addEventListener('click', getAttr);
                //map.centerAndZoom(point, map.getZoom());
                //map.addOverlay(lastMark);
                //location = JSON.stringify({ lat: point.lat, lng: point.lng });
            }
            else {
                $.messager.alert('提示', '找不到对应的位置信息!', 'info');
                location = null;
            }
        }, "广州市");
}

function getAttr() {
    var p = lastMark.getPosition();              //获取marker的位置
    alert("标注的位置是[" + p.lng + "," + p.lat + ']。');
}

function InitEvents() {
    $('#lnkSave').bind("click", function () {
        if (!selectLoc) {
            $.messager.confirm('保存确认', '您还没有选择位置，是否关闭?', function (r) {
                if (r) {
                    dialogHelper.closeModal({});
                }
            });
        } else {
            //result.location = selectLoc;
            dialogHelper.closeModal({location: selectLoc});
        }
    });
}

function InitDefaultLocation() {
    var lat, lng;
    lat = parseFloat($.getUrlParam('lat'));
    lng = parseFloat($.getUrlParam('lng'));
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        hasDefCenter = true;
        defCenter = new BMap.Point(lng, lat);
        AddOverlay(defCenter, defLevel);
    }
    else {
        hasDefCenter = false;
        defCenter = avtMap.defaultCenter;
    }
}

function AddOverlay(point, center) {
    clearOverlays();
    lastMark = new BMap.Marker(point);
    lastMark.addEventListener('click', getAttr);
    map.centerAndZoom(point, center?center:map.getZoom());
    map.addOverlay(lastMark);
    selectLoc = JSON.stringify({ lat: point.lat, lng: point.lng });
}

function clearOverlays() {
    map.clearOverlays();
}

function resetMap() {
    clearOverlays();
    if (hasDefCenter) {
        AddOverlay(defCenter);
    } else {
        map.centerAndZoom(defCenter, map.getZoom());
    }
}