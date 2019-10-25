var shareBtn = $("#shareBtn"),
  sharePopup = $(".share_popup"),
  yhqid = getUrlParam("yhqid"),
  activityId = "",
  yhqID = "";

console.log(yhqid)

$.ajax({
  type: 'get',
  url: apiBase + '/myyhqdetail?uid=' + cache.getUserId(),
  data: {
    yhqid
  },
  dataType: 'json',
  success: function(res) {
    console.log(res)
    if (res.successed) {
      let result = res.data[0];
      let dateStart = result.activity_date_start.split(" ")[0]
      let dateEnd = result.activity_date_end.split(" ")[0]
      console.log(result)
      $(".deduCoupon").text(result.yhq);
      $("#titles").text(result.activity_topic);
      $("#datatime").text(dateStart + '~' + dateEnd)
      activityId = result.activity_id;
      yhqID = result.yhqID;
    }
  }
})

function updateYhq(){
  $.ajax({
    type: 'get',
    url:  apiBase + "/updateyhq",
    data:{
      yhqid
    },
    dataType: 'json',
    success:function(res){
      console.log(res)
      if(res.data!=[]){
        window.location.href = "http://activity.huanxinkeji.cn/activity/activity-details.html?activityid=" + activityId ;
      }
    }
  })
}



shareBtn.on('click', function() {
  sharePopup.show()
})

sharePopup.on('click', function() {
  sharePopup.hide()
})



$("#linkActivity").on('click',function() {
  console.log(yhqID)
  console.log(activityId)
  updateYhq()
})


var userid = cache.getUserId();
if (!userid) userid = common.query().userid;
if (!userid) {
  alert('页面缺失重要参数，非法加载!');
}
user.getInfo(userid, function(result) {
  console.log(result)
  if (result.successed) {
    $('#spanUserName').text(result.data.user_name);
    $("#imgUserHeader").attr("src", imageServer + common.replace(result.data.user_image, '\\\\', '\/') + "?ran=" +
      new Date().getTime());
    $('#mobile').html(result.data.user_mobile);
    if (result.data.vip_count > 0)
      $("#a_info").show();
    cache.setUserId(result.data.user_id);
    cache.setUserInfo(result.data);
  } else {
    alert("失败")
  }
}, function(err) {
  console.log(err)
});


$(".share_popup").get(0).addEventListener('touchmove', function(e) {
  e.preventDefault();
}, false);