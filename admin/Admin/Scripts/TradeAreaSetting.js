var avtMap;
var map;
var addressInput;
var myInputValue;
var lastMark;
var initLevel = 16;
var polygon;
var areaid;
var areaName;
var range;
var cntlat;
var cntlng;

$(function () {
    areaid = $.getUrlParam('areaid');
    areaName = $.getUrlParam('name');
    range = $.getUrlParam('range');
    cntlat = $.getUrlParam('cntlat');
    cntlng = $.getUrlParam('cntlng');
    //testSetPolygon();
    if (areaid) {
        avtMap = new AVTMap("mapcontainer", {
            defaultLevel: initLevel,
            disableDoubleClickZoom: true,
            showScale: true,
            showNavigation: true,
            longitude: 0,
            latitude: 0,
            defaultLocation: false
        });
        if (avtMap) {
            map = avtMap.map;
            initLevel = map.getZoom();
            setDefaultValues();
            initEvents();
            InitSmartAddressInput();
        }
    }
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

    if (areaName) {
        addressInput.setInputValue(areaName);
    }
}

function setPlace() {
    function myFun() {
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        map.centerAndZoom(pp, initLevel);
        AddOverlay(pp);
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myInputValue);
}

function AddOverlay(point, center) {
    if (lastMark) {
        map.removeOverlay(lastMark);
    }
    lastMark = new BMap.Marker(point);
    //lastMark.addEventListener('click', getAttr);
    map.centerAndZoom(point, center?center:map.getZoom());
    map.addOverlay(lastMark);
    selectLoc = JSON.stringify({ lat: point.lat, lng: point.lng });
}

function setDefaultValues() {
        if (areaName) {
            $('#tradeArea').val(areaName);
        }
        if (range) {
            var loc = JSON.parse(range);
            var pathPoints = [];
            if (loc.length > 3) {
                initLevel = loc[0];
                for (i = 1; i < loc.length; ++i)
                    pathPoints.push(new BMap.Point(loc[i][0], loc[i][1]));
            }
            polygon = avtMap.drawPolygon(pathPoints);
            if (cntlat && cntlng) {
                avtMap.focusToPoint(new BMap.Point(cntlng, cntlat), initLevel, true);
            } else {
                avtMap.focusToPolygon(polygon, initLevel, true);
                var center = avtMap.getPolygonCenter();
                cntlat = center.lat;
                cntlng = center.lng;
            }
        }
}

function setBounds(flag) {
    if (map) {
        if (flag) {
            avtMap.enterDrawMode();
        } else {
            avtMap.exitDrawMode();
            clearValues();
        };
    }
}

function clearValues() {
    polygon = null;
    range = null;
    cntlat = null;
    cntlng = null;
}

function initEvents() {
    $('#lnkSave').bind("click", function () {
        getLocationFromMap();
        if (!range) {
            $.messager.confirm('保存确认', '您还没有选择位置，是否关闭?', function (r) {
                if (r) {
                    dialogHelper.closeModal({});
                }
            });
        } else {
            dialogHelper.closeModal({ range: range, cntlat: cntlat, cntlng: cntlng });
        }
    });
}

function getLocationFromMap(){
    if (avtMap.polygon) {
        polygon = avtMap.polygon;
        var center = avtMap.getPolygonCenter(polygon);
        cntlat = center.lat;
        cntlng = center.lng;
        initLevel = avtMap.curLevel();
        range = getRangeString();
    }
    else {
        clearValues();
    }
}

function getRangeString() {
    if (cntlat && cntlng && initLevel && polygon) {
        var range = [];
        range[0] = initLevel;
        var pathPoints = polygon.getPath();
        for(i = 0; i<pathPoints.length; ++i){
            range[1+i] = [ pathPoints[i].lng, pathPoints[i].lat];
        }
        return JSON.stringify(range);
    }
    return null;
}
