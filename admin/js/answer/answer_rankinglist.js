var rPopup = $(".r_popup"),
  body = $("body"),
  flag = true,
  page = 1,
  rows = 20


// 是否打开客服弹窗
function isPopup(flag) {
  if (flag == true) {
    rPopup.show()
    body.addClass("notScroll")
  } else {
    rPopup.hide()
    body.removeClass("notScroll")
  }
}

console.log(getUrlParam("id"))
// 排行榜的请求
function rinkList(page) {
  $.ajax({
    type: 'get',
    url: apiBase + '/myphb?uid=' + cache.getUserId(),
    data: {
      page,
      rows
    },
    dataType: 'json',
    success: function(res) {
      let result = res.data


      flag = true;
      console.log(result)
      var list = template('list', {
        item_list: result.phb
      });
      $("#rink_common").append(list)

      let myselfInfo = res.data.myself
       console.log(myselfInfo)
      if (res.message == "用户不存在" || myselfInfo  == undefined) {
        $(".user").hide()
      }

      if (myselfInfo.usedtime == "100%") {
        $(".succ_boxs").show();
      } else {
        $(".succ_boxs").hide();
      }
      //用户名字
      $("#myname").text(myselfInfo.user_name || '参赛者')
      //使用时间
      $("#myusedtime").text(myselfInfo.usedtime)
      //正确率
      $("#myright").text(myselfInfo.accuracy)
      //头像
      $("#myImg").attr("src", imageServer + myselfInfo.user_image)
      let myAllRight = myselfInfo.allrightph;
      if (myAllRight < 10) {
        myAllRight = '00' + myAllRight;
      } else if (myAllRight >= 10 && myAllRight < 100) {
        myAllRight = '00' + myAllRight;
      } else if (myAllRight >= 100 && myAllRight < 1000) {
        myAllRight = '0' + myAllRight;
      }
      $("#myAllRight").text(myAllRight)

      $("#myuhead").text(myselfInfo.pm)
    }
  })
}
rinkList(page)

//滚动条到页面底部加载更多案例
$(window).scroll(function() {
  var scrollTop = $(this).scrollTop(); //滚动条距离顶部的高度
  var scrollHeight = $(document).height(); //当前页面的总高度
  var clientHeight = $(this).height(); //当前可视的页面高度
  if ((scrollTop + clientHeight + 200) >= scrollHeight) { //距离顶部+当前高度 >=文档总高度 即代表滑动到底部
    if (flag) {
      flag = false;
      ++page;
      setTimeout(function() {
        rinkList(page)
        console.log(page)
      }, 700);
    }
  }
});

$(".r_popup").get(0).addEventListener('touchmove', function(e) {
  e.preventDefault();
}, false);
