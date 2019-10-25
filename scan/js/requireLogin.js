$(function () {
    var toIndex = function () {
        //window.location.href = '/index.html';
    }
    var tokenStr = common.getCache('token');
    if (common.isEmpty(tokenStr)) {
        toIndex();
        return;
    }
    try {
        var tokenCache = JSON.parse(tokenStr);
        if (common.isEmpty(tokenCache.token)) {
            toIndex();
            return;
        }
    }
    catch (e) {
        toIndex();
        return;
    }

})
