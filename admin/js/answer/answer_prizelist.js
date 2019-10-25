var rPopup = $(".r_popup"),
  body = $("body"),
  flag = true,
  page = 1,
  rows = 20,
  activityId = "",
  yhqId = ""


prizeList(page);

function prizeList(page) {
  $.ajax({
    type: 'get',
    url: apiBase + '/myyhqlist?uid=' + cache.getUserId(),
    data: {
      page,
      rows
    },
    dataType: 'json',
    success: function(res) {
      console.log(res)
      let resData = res.data;
      if (resData.length != 0) {
        
        for(let i = 0; i<resData.length; i++) {
          resData[i].activity_date_end = resData[i].activity_date_end.split(" ")[0]
          resData[i].activity_date_start = resData[i].activity_date_start.split(" ")[0]
        }
        activityId = resData[0].activity_id
        console.log(activityId)
        yhqId = resData[0].yhq
        console.log(resData)
        var list = template('list', {
          item_list: resData
        });
        $("#pList").append(list)
      }
      
      
      console.log($(".contInfo"))
      $(".contInfo").on('click',function(){
        Prompt(".Prompt","该优惠券已使用过");
      })
    }
  })
}



//滚动条到页面底部加载更多案例
// $(window).scroll(function() {
//   var scrollTop = $(this).scrollTop(); //滚动条距离顶部的高度
//   var scrollHeight = $(document).height(); //当前页面的总高度
//   var clientHeight = $(this).height(); //当前可视的页面高度
//   if ((scrollTop + clientHeight + 200) >= scrollHeight) { //距离顶部+当前高度 >=文档总高度 即代表滑动到底部
//     if (flag) {
//       flag = false;
//       ++page;
//       setTimeout(function() {
//         prizeList(page)
//         console.log(page)
//       }, 700);
//     }
//   }
// });
$("#linkActivity").on('click',function() {
  console.log("http://activity.huanxinkeji.cn/activity/activity-details.html?activityid=" + activityId)
  window.location.href = "http://activity.huanxinkeji.cn/activity/activity-details.html?activityid=" + activityId;
})



