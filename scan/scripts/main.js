$(function(){
  // music
  var audio = document.querySelector("audio");
  var musicLogo = $(".music-logo");
  var isPlaying = true;

  musicLogo.addClass("playing");
  audio.src = "video/bg.mp3";

  audio.play();

  musicLogo.click(function() {
    // $(this).toggleClass('playing');
    isPlaying = !isPlaying;
    if(isPlaying) {
      $(this).css('animation-play-state', 'running');
      audio.play();
    }else{
      $(this).css('animation-play-state', 'paused');
      audio.pause();
    }
  })
  

  // init swiper
  var swiper = new Swiper('.swiper-container', {
      paginationClickable: true,
      threshold: 100000,
      initialSlide: 0
  });

  var name, tel, error = [];

  // select option
  $('.question-container').click(function(e){
    var $target = $(e.target)
    var $option = null;
    var wrong = false;

    if($target.hasClass('option-item')) {
      $option = $target;
      wrong = selectOption($option);
    }else {
      if($target.parents('.option-item').length) {
        $option = $target.parents('.option-item');
        wrong = selectOption($option);
      }
    }

    if(wrong) {
      error.push(wrong)
    }
    
  })

  // 开始答题
  $('.question-page .start').click(function(){
    swiper.slideNext()
  })

  // 点击按钮切换下一页
  $('.question-page .next').click(function(){
    if($(this).hasClass('result')) {
      var passed = checkInput() // 验证姓名，电话

      if(!!passed) {
        name = passed.name;
        tel = passed.tel;

        var score = 100 - parseInt(error.length*100/12);
        console.log(name, tel, score, error)

        $.ajax({
          url: 'http://activity.lanmeihui.com.cn/Api/ActivityCollect.aspx?action=SubmitTest',
          // url: 'http://192.168.1.196:9005/Api/ActivityCollect.aspx?action=SubmitTest',
          method: 'post',
          data: {name: name, tel: tel, score: score, error: JSON.stringify(error)},
          success: function(xhr) {
            console.log('已成功提交服务器')
          }
        })

        $('.score-container .score').text(score+'分');
        $('#js-percent').text(parseInt(score*0.99)+'%')

        swiper.slideNext()

        if(score > 89) {
          return $('#js-message').text('未来的营销栋梁之才，你值得在此次特训营中收获更多人脉和机遇');
        }
        if(score > 79) {
          return $('#js-message').text('你的营销功底深厚，还需要注重创新哦，希望导师们能带给你新启发');
        }
        if(score > 59) {
          return $('#js-message').text('基础还扎实，正是需要提升营销应用能力的时候');
        }
        if(score > 39) {
          return $('#js-message').text('有营销意识，但仍需专业指导，本期课程可以助你一臂之力');
        }
        if(score < 40) {
          return $('#js-message').text('兄弟你很弱哦，除了认真听课，多读相关书籍也必不可少');
        }

      } 
    } else {
      if($(this).data('selected')){
        swiper.slideNext()
      }else{
        showTips('请选择一个您认为正确的选项')
      }
    }
  })

  // 邀请
  $('.question-page .share').click(function(){
    $('.share-tips').addClass('show');
  })

  $('.share-tips').click(function() {
    $(this).removeClass('show')
  })

  WechatShare();
})

function checkInput() {
  var name = $('input.name').val().replace(' ', '');
  var tel = $('input.tel').val().replace(' ', '');
  if(!name.length) {
    showTips('请输入姓名')
    return false
  }

  if(tel.length > 13 || !/^1\d{10}/.test(tel)) {
    showTips('请输入正确的手机号码')
    return false
  }

  return {name: name, tel: tel}
}

function showTips(info) {
  $('.error-tips').text(info).addClass('show');
  setTimeout(function(){
    $('.error-tips').removeClass('show')
  }, 3000)
}

function selectOption(target) {
  var $target = target;
  var $container = $target.parents('.question-container');
  var index = $container.find('.position em').text();
  var wrong = {}
  var value;
  var timer = null;

  $container.siblings('.next').data('selected', true);
  $container.unbind('click');

  switch($target.index()) {
    case 0:
      value = 'A';
      break;
    case 1:
      value = 'B';
      break;
    case 2:
      value = 'C';
      break;
    case 3:
      value = 'D';
      break;
    case 4:
      value = 'E';
      break;
    default:
      break;
  }

  if($target.attr('data-correct') == 'true') {
    $target.addClass('correct');
    return false
  }else{
    $target.addClass('wrong');
    wrong[index] = value;

    clearTimeout(timer)
    
    timer = setTimeout(function(){
      $target.siblings('.option-item').each(function(index, item){
        if($(item).attr('data-correct') == 'true') {
          $(item).addClass('correct');
        }
      })
    }, 500)

    return wrong;
  }
  
}

// 微信分享
function WechatShare() {
    var url = window.location.href;
    var title = "测测你的营销战斗指数";
    var desc = "要学营销？先来测测你到营销哪个阶段了？";
    var imgUrl = "http://activity.15emall.com/questions/images/thumb.jpg";
    var link = url;
    var timestamp = (new Date()).valueOf();

    $.ajax({
        url: 'http://activity.15emall.com/Api/WechatApi.aspx',
        data: { action: "GetSignature", noncestr: "lanmeihuih5", timestamp: timestamp, url: url },
        success: function(data) {
            var json = JSON.parse(data);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                // appId: 'wxe333e2eb885056b7', // 必填，公众号的唯一标识
                appId: 'wx2168e72523959a1d',
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: 'lanmeihuih5', // 必填，生成签名的随机串
                signature: json.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });


            wx.ready(function() {

                wx.onMenuShareTimeline({
                    title: title,
                    link: link,
                    imgUrl: imgUrl,
                    success: function(res) {
                        // alert('onMenuShareTimeline')
                    },
                    fail: function(res) {
                      // alert(imgUrl)
                    }
                })

                wx.onMenuShareAppMessage({
                    title: title,
                    link: link,
                    imgUrl: imgUrl,
                    desc: desc,
                    success: function() {
                        // alert('onMenuShareAppMessage')
                    },
                    cancel: function() {
                      // alert(11111)
                    }
                })

            })
        }
    })
}
