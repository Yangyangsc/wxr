/* 图片资源预加载 */
$(function() {
		//获取数组长度，进度元素，设置页数，进度初始值
		var len = imgSrcArr.length,
		count = 0,
		$progress = $(".progress");

		//遍历数组，获取数组内全部路径
		$.each(imgSrcArr, function(i,src) {
			//声明一个图像对象
			var imgObj = new Image();
			//设置所有图片在加载中或者加载失败时触发时间
			$(imgObj).on("load error",function(){
				//设置进度显示数字（因为each会自动循环 每次都会用获得数组数量除以总数从而获得百分比）
				$progress.html(Math.round((count + 1) / len * 100) + "%");
				//console.log(Math.round((count + 1) / len * 100) + "%");
				//如果循环次数等于数组长度 即代表全部图片加载完毕
				if(count >= len - 1){
					//图片全部加载完毕后隐藏百分比进度
					imgLoadTime = setTimeout(() => {
						clearTimeout(imgLoadTime);
						$(".loading").hide();
					},500)
				}
				//每一次循环加1
				count++;
			});

			//设置所有图片的路径等于数组内的路径
			imgObj.src = src;
		});
});
