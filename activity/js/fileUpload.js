upload = {
	html5Upload: function(url, file, options) {
		options = $.extend(true, {
			data: {
				filetype: 'brand'
			},
			onProgress: () => {},
			onLoad: () => {},
			onError: () => {},
			onAbout: () => {},
		}, options);
		if(typeof window != 'object')
			return;
		var oXHR = null
		if(window.ActiveXObject) { // 如果是IE浏览器 
			oXHR = new ActiveXObject('Microsoft.XMLHTTP')
		} else if(window.XMLHttpRequest) { // 非IE浏览器 
			oXHR = new XMLHttpRequest()
		}
		var vFD = new FormData();
		//var blob = this.dataURItoBlob(base64File);
		vFD.append(file.name, file);
		for(let key in options.data) {
			vFD.append(key, options.data[key]);
		}
		oXHR.upload.addEventListener('progress', e => {
			options.onProgress(e, file)
		}, false)
		oXHR.addEventListener('load', e => {
			options.onLoad(e, file)
		}, false)
		oXHR.addEventListener('error', e => {
			options.onError(e, file)
		}, false)
		oXHR.addEventListener('abort', e => {
			options.onAbout(e, file)
		}, false)
		try {
			oXHR.open('post', url)
			oXHR.send(vFD)
		} catch(e) {
			options.onError(e, file)
		}
	}
}