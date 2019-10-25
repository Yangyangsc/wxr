var detailForm;
var key;
var cntLat;
var cntLng;

$(document).ready(function () {
    $('#hidregionUid').val($.getUrlParam('parentUid'));
    key = $.getUrlParam('key');
    detailForm = new detailForm('aspnetForm', {
        bindOption: {
            url: rootVirtual + '/Admin/TradeDetail.aspx?datakey=tradearea',
            successFunc: function (result) {
                if ($('#hidAreaRange').val()) {
                    setTexts();
                }
            }},
        saveOption: {
            button: '#lnkSave', url: rootVirtual + '/Admin/TradeDetail.aspx?datakey=tradearea',
            successFunc: function (result) {
                result.name = $("#areaName").val();
                dialogHelper.closeModal(result);
            }
        }
    });
    detailForm.bindForm();
});

function selectTradeAreaLocation() {
    var fullUrl = rootVirtual + '/Admin/SetTradeAreaLocation.aspx?areaid=' + key;
    var areaName = $('#areaName').val();
    var cntLat = $('#hidCntLat').val();
    var cntLng = $('#hidCntLng').val();
    var range = $('#hidAreaRange').val();
    if (areaName && $.trim(areaName) != '') {
        fullUrl += "&name=" + $.trim(areaName);
    }
    if (cntLat && cntLng && range) {
        fullUrl += "&cntlat=" + cntLat + "&cntlng=" + cntLng + "&range=" + range;
    }
    dialogHelper.showModal({
        title: '设置商圈位置信息',
        url: fullUrl,
        width: 600,
        height: 500,
        icon: 'icon-import',
        closeFunc: function (result, param) {
            if (result.range && result.cntlat && result.cntlng) {
                $('#hidAreaRange').val(result.range);
                $('#hidCntLat').val(result.cntlat);
                $('#hidCntLng').val(result.cntlng);
                setTexts();
            }
        }
    });
}

function setTexts(){
    cntLat = $('#hidCntLat').val();
    cntLng = $('#hidCntLng').val();
    if (!cntLat || !cntLat || cntLat.length == 0 || cntLng.length == 0) {
        $('#areaLocation').val("未设置");
        cntLat = null;
        cntLng = null;
    } else {
        $('#areaLocation').val(parseFloat(cntLat).toFixed(5) + ',' + parseFloat(cntLng).toFixed(5));
    }
}