// 屏幕自适应
(function (width, rem) {
	document.documentElement.style.fontSize = getSize();
	window.addEventListener('resize', function () {
		document.documentElement.style.fontSize = getSize();
	});
	function getSize() {
		var size = (document.documentElement.getBoundingClientRect().width / width) * rem;
		return size + 'px';
	}
})(750, 100);