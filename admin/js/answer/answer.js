var noticeInterval = 3, //答题须知界面显示停留时间
  noticeTime = '', //答题须知界面计时器
  answeTimeNumber = 200, //答题允许的总时间
  answeInterval = 1000, //答题总时间计时器间隔
  answeTime = '', //答题总时间计时器
  prepareTimeNumber = 3, //准备开始答题倒计时总时间
  prepareInterval = 1000, //准备开始答题计时器间隔
  prepareTime = '', //准备开始计时器
  compression = {}, //性别 职业存储变量
  answerLen = 1, //答题数量
  music = document.getElementById('bgMusic'), //背景音乐元素
  openDoorMusic = document.getElementById('openDoor'), //开门的音乐元素
  countDownMusic = document.getElementById('countDownMusic'), //倒计时的音乐元素
  homeBox = $('.homeBox'), //主页容器元素
  mustBox = $('.mustBox'), //答题须知元素
  answerBox = $('.answerBox'), //答题容器元素
  countDownBox = $('.countDownBox'), //答题显示前的倒计时元素
  perfect = $('.perfect'), //完善资料元素
  audioBtn = $('#audioBtn'), //背景音乐播放控制按钮
  resultBox = $('.resultBox'), //结果界面容器元素
  countDownImg = $('.countDown img'), //倒计时数字元素
  knowBut = $('.knowBut'), //名次弹窗关闭按钮
  gender = $('.gender'), //选择性别按钮
  post = $('.post'), //选择职业按钮
  perfectBut = $('.perfect .test'), //开始测试按钮
  startBut = $('.startBut'), //准备进入答题按钮
  m_testBut = $('.m_testBut'), //正式开始答题按钮
  topicList = $('.topicBox ul li'), //选择题目元素
  topicBox = $('.topicBox'), //问题内容容器
  mask = $('.mask'); //名次弹窗蒙层元素
challenge = $('.challenge'), //重新开始
  buyBut = $('.buyBut'), //立即购票
  imgSrc = './images/answer/number_', //数字图片路径
  daoImgSrc = './images/answer/daoNumber_', //倒计时图片路径
  posterImgSrc = './images/answer/result_', //数字图片路径
  imgSrc = './images/answer/number_', //数字图片路径
  http = 'http://webapi.huanxinkeji.cn', //域名
  letter = ['a', 'b', 'c', 'd'], //字母
  answerType = ['运营', '文案', '热点'], //答题类型
  sysH = $(document).height(), //获取高度
  take_count = 0, //剩余次数
  share_count = 0, //分享次数
  answerData = [], //答题数据数组
  isSubmit = false, //是否正在提交答案
  resultData = {
    uid: '',
    result_id: '',
    data: []
  }, //回答结果存储变量
  genderStr = localStorage.getItem('gender'),
  postStr = localStorage.getItem('post'),
  userid = cache.getUserId(), //获取用户的userid
  yhq_id = 0;

//设置门背景图定位
$('#leftDoor, #rightDoor').css('background-position-y', -(($('#leftDoor').innerHeight() - sysH) / 2) + 'px');
//window.history.forward(1);

// 获取用户的个人信息
user.getInfo(userid, function(result) {
  $('#user_name').text(result.data.user_name || '参赛者');
  $('#imgUserHeader').attr('src', imageServer + common.replace(result.data.user_image, '\\\\', '\/') + '?ran=' +
    new Date().getTime());
  cache.setUserId(result.data.user_id);
  cache.setUserInfo(result.data);
}, function(err) {
  message.toast('获取数据失败', 'error');
});

wx.hideAllNonBaseMenuItem();

/**
 * 完善资料 
 */

//选择性别
gender.click(function() {
  localStorage.setItem('gender', $(this).attr('data-type')); //获取性别对应值
  genderStr = localStorage.getItem('gender');
  console.log(genderStr)
  if (genderStr == '1') {
    $('.peopleManBox').show();
    $('.peopleGirlBox').hide();
  } else if (genderStr == '0') {
    $('.peopleGirlBox').show();
    $('.peopleManBox').hide();
  }
  $(this).prop('class', 'gender genderOn').siblings().prop('class', 'gender genderOff');
});

//选择职业
post.click(function() {
  localStorage.setItem('post', $(this).attr('data-type')); //获取职业对应值
  postStr = localStorage.getItem('post');
  $(this).prop('class', 'post postOn').siblings().prop('class', 'post postOff');
});

if (genderStr == '1') {
  $('.peopleManBox').show();
  $('.peopleGirlBox').hide();
} else if (genderStr == '0') {
  $('.peopleGirlBox').show();
  $('.peopleManBox').hide();
}

//若已完善资料 则隐藏完善资料界面
if (genderStr && postStr) {
  $('.perfect').hide();
  $('.homeBox').css('display', 'flex');
  music.play();
  //starting();
} else {
  $('.perfect').show();
  $('.homeBox').css('display', 'none');
}

/**
 * 开始测试
 */
perfectBut.click(function() {
  if (!genderStr) {
    console.log('性别请选择')
  } else if (!postStr) {
    console.log('职业请选择')
  } else {
    console.log('提交测试');
    perfect.hide(); //隐藏完善资料
    homeBox.css('display', 'flex');
    music.play();
    //starting();
  }
});

/**
 * 主页逻辑
 */

//页面跳转 
$('.jump').click(function() {
  window.location.replace($(this).attr('data-href'));
});

//准备进入答题
startBut.click(function() {
  if (take_count != 0) {
    homeBox.hide();
    mustBox.show();
  } else {
    if (!take_count) {
      if (share_count == 2) {
        $('.answerHavePopup').show();
      } else {
        $('.answerNotPopup').show();
      }
    }
  }
});

//次数蒙层隐藏
$('.answerHavePopup,.answerNotPopup').click(function() {
  $(this).hide();
})

//正式开始答题
m_testBut.click(function() {
  answeTimeNumber = 200;
  setTimeout(function() {
    $('#leftDoor').addClass('leftDoorOn1');
    $('#rightDoor').addClass('rightDoorOn1');
    
  }, 2000)
  
  console.log(music.paused)
  if(!music.paused){
     music.pause();
     openDoorMusic.play();
  }
  setTimeout(function() {
    countDownMusic.play();
    
  }, 2500)
  setTimeout(function() {
    openDoorMusic.play();
    starting();
  }, 5000);
  setTimeout(function() {
    openDoorMusic.play();
  }, 7000);
  answerShowFun();
});

//背景音乐播放控制
audioBtn.click(function() {
  if (music.paused) {
    music.play();
    audioBtn.removeClass('bgMusicOff').addClass('bgMusicOn'); //播放背景音乐
  } else {
    music.pause();
    audioBtn.removeClass('bgMusicOn').addClass('bgMusicOff'); //暂停背景音乐
  }
});

/**
 * 答题逻辑
 */

//答题总用时倒计时
function countDownFun() {
  answeTime = setInterval(function() {
    answeTimeNumber = answeTimeNumber - 1;
    var timeLen = answeTimeNumber.toString().length;

    if (answeTimeNumber == 0) {
      clearInterval(answeTime); //销毁并回收 答题总用时计时器
      portion();
    }

    if (timeLen == 1) {
      answeTimeNumber = '00' + answeTimeNumber;
    } else if (timeLen == 2) {
      answeTimeNumber = '0' + answeTimeNumber;
    } else {
      answeTimeNumber = answeTimeNumber.toString();
    }

    $('.countDown').html(answeTimeNumber)
    // if (answeTimeNumber == '001') {
    //   $('.countDown').html(0);
    // } else {
    //   $('.countDown').html(answeTimeNumber)
    // }
    // console.log(answeTimeNumber)
  }, answeInterval);
}

//开始答题
function answerShowFun() {
  countDownBox.css('display', 'flex'); //显示答题倒计时

  var animationTime = setTimeout(function() {
    clearTimeout(animationTime);   
    
    mustBox.hide();
    answerBox.show(); //显示答题部分
    
    $('.c_number').show();
    $('.c_number img').prop('src', daoImgSrc + prepareTimeNumber + '.png')

    prepareTime = setInterval(function() {
      prepareTimeNumber = prepareTimeNumber - 1;
      if (prepareTimeNumber != 0) $('.c_number img').prop('src', daoImgSrc + prepareTimeNumber + '.png')

      if (prepareTimeNumber == 0) {
        clearInterval(prepareTime); //销毁并回收 答题遮罩层计时器

        $('.c_number img').hide();
        $('#leftDoor').addClass('leftDoorOff');
        $('#rightDoor').addClass('rightDoorOff');

        var respondenceTime = setTimeout(function() {
          clearTimeout(respondenceTime);

          $('#leftDoor').addClass('leftDoorOff1').removeClass('leftDoorOn1');
          $('#rightDoor').addClass('rightDoorOff1').removeClass('rightDoorOn1');

          countDownBox.hide(); //隐藏倒计时界面
          
          // 这里放321的音乐

        }, 2000);
      }
    }, prepareInterval);
  }, 2500);
}



//选择题目
$('.answerContainer').on('click', '.topicBox ul li', function() {
  $('#leftDoor').removeClass('leftDoorOff leftDoorOff1');
  $('#rightDoor').removeClass('rightDoorOff rightDoorOff1');

  $(this).prop('class', 'answerOn');
  if (!isSubmit) {
    var topParents = $(this).parents('.topicBox'); //获取题目父级元素
    var topParentsEq = topParents.index(); //获取当前题目位置
    var location = toChinesNum(topParentsEq + 1); //题目位置中文

    //如果转换中文数字两位数后出现中文 ‘一’ 则过滤掉
    if (location.length == 2 || location.length == 3) {
      if (location.substring(0, 1) == '一') location = location.substring(1, location.length);
    }

    //如果已经到了最后一道题 那中文只能显示到最后一题
    if (topParentsEq == answerData.length) location = toChinesNum(answerData.length);

    //获取题目类型
    var answerOnTime = setTimeout(function() {
      $('.answerInfo .omit').eq(0).text('第' + location + '题');
      $('.answerInfo .omit').eq(1).text(answerType[answerData[topParentsEq - 1].cat_id - 1] + '篇');
      topParents.next().show().siblings().hide(); //显示下一个题目
      $('.answerInfo').show()
      clearTimeout(answerOnTime);
    }, 300);

    resultData.uid = userid;
    resultData.data.push({
      qid: answerData[topParentsEq - 1].id,
      answer: letter[$(this).index()]
    })

    if (topParentsEq == answerLen) {
      portion();
    }
  }
})

//出现答题结果部分逻辑
function portion() {
  $('.c_number img').show().prop('src', '');
  $('.schedule').css('display', 'flex').find('p').text('正在根据答题情况正在计算结果');
 // answeTimeNumber = 200;
  checkanswer();
  clearInterval(answeTime);
  isSubmit = true;
  $('.topicBox ul li').prop('class', 'answerOff');
}

/* 名次弹窗关闭 */
knowBut.click(function() {
  mask.hide();
});

//重新开始
challenge.click(function() {
  $('.resultBox.answerBox,.topicBox,.homeBox,.mustBox,.resultBox,.mask,.countDownBox').hide();
  $('.homeBox').show();
  resultData.data = [];
  answerCount();
  $('.topicBox').hide();
  //starting();
  $('.answerInfo .omit').eq(0).text('第一题');
 // answeTimeNumber = 200;
  clearInterval(answeTime);
  clearInterval(prepareTime);
});


//立即购票
buyBut.click(function() {
  $('.schedule').css('display', 'flex').find('p').text('正在根据答题情况正在计算奖品');
  setTimeout(function() {
    $('.schedule').hide();
    window.location.href = '../../answer_receiveprize.html?yhqid=' + yhq_id;
  }, 5000);
});
var double = 3;
/* 海报生成 */
function createPoster(count,defeat) {

  var c = document.getElementById('myCanvas');
  var ctx = c.getContext('2d');
  var img = document.getElementById('scream');
  var img2 = document.getElementById('scream2');
  var img3 = document.getElementById('scream3');
  var usernameT = cache.getUserInfo().user_name;
  usernameT = usernameT == '' ? '参赛者' : usernameT;
  var examinee = '考生:' + usernameT;
  var serialNumber = '考试号:' + resultData.result_id;
  var fontColor = '#00517f';
  var percentage_fontColor = 'black';
  var fontSize = 16;
  var percentage_fontSize = 26;

  c.width = times(340);
  c.height = times(600);

  if (examinee.length > 9) {
    examinee = examinee.substring(0, 9) + '...'
  }
  ///console.log(posterImgSrc + count + '.jpg');
  $('.r_content').prop('src', posterImgSrc + count + '.jpg');
  img2.src = posterImgSrc + count + '.jpg'
  setTimeout(function() {
    ctx.drawImage(img2, times(10), times(83.5), times(320), times(393));
    ctx.drawImage(img, 0, 0, times(340), times(600));
    canvas_text(ctx, examinee, times(fontSize).toString() + 'px bold 黑体', fontColor, times(57), shrink(4), 0);
    canvas_text(ctx, serialNumber, times(fontSize).toString() + 'px bold 黑体', fontColor, times(57), shrink(1.35), 0);
    canvas_text(ctx, defeat, times(percentage_fontSize).toString() + 'px bold 黑体', percentage_fontColor, times(112), shrink(1.66), 1);
    var tempSrc = c.toDataURL('image/png');
    img3.src = tempSrc;
  }, 500)

}

// Canvas居中写字，参数（context对象，要写的字，字体，颜色，绘制的高度,宽度除以几,字体是否填色）
function canvas_text(_paint, _text, _fontSzie, _color, _height, _number,_fill) {
  _paint.font = _fontSzie;
  _paint.textAlign = 'center';
  if (_fill) {
    _paint.fillStyle = _color;
    _paint.fillText(_text, 340 / _number, _height);
  } else {
    _paint.fillStyle = _color;
    _paint.textBaseline = 'middle';
    _paint.fillText(_text, 340 / _number, _height);
  } 
}

//值 放大的倍数
function times(number) {
  return parseInt(number * double);
}

//值 缩小的倍数
function shrink(number) {
  return number / double;
}

//阿拉伯数字转化为中文数字
function toChinesNum(num) {
  var changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = '零'
  var unit = ['', '十', '百', '千', '万'];
  num = parseInt(num);
  var getWan = (temp) => {
    var strArr = temp.toString().split('').reverse();
    var newNum = '';
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? '' : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? '' : changeNum[
        strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
    }
    return newNum;
  }
  var overWan = Math.floor(num / 10000);
  var noWan = num % 10000;
  if (noWan.toString().length < 4) noWan = '0' + noWan;
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num);
}

//获取所有答题
function starting() {
  $.get(http + '/starting', {
    sex: genderStr,
    jod: postStr,
    uid: userid
  }, function(result) {
    resultData.result_id = result.result_id;
    answerData = result.data;
    console.log(answerData);
    for (var i = 0; i < answerData.length; i++) {
      data = answerData[i];
      var str =
        '<div class="topicBox">' +
        '<div>' +
        '<p class="omit3">' + data.que + '</p>' +
        '</div>' +
        '<ul>' +
        '<li class="answerOff"><span>' + data.opt1 + '</span></li>' +
        '<li class="answerOff"><span>' + data.opt2 + '</span></li>' +
        '<li class="answerOff"><span>' + data.opt3 + '</span></li>' +
        '<li class="answerOff"><span>' + data.opt4 + '</span></li>' +
        '</ul>' +
        '</div>'
      $('.answerContainer').append(str);
    }
    $('.answerInfo .omit').eq(1).text(answerType[answerData[0].cat_id - 1] + '篇');
    answerLen = result.data.length;

    $('.topicBox').eq(0).show(); //显示第一条题目

    countDownFun(); //开始倒计时
    prepareTimeNumber = 3;
  });
}

//获取答题次数
function answerCount() {
  $.get(http + '/startpage', {
    uid: userid
  }, function(result) {
    $('.residue').text('剩余次数:' + result.data.take_count + '次')
    take_count = result.data.take_count;
    share_count = result.data.share_count;
  });
}

answerCount();

//提交所有答题选择
function checkanswer() {
  $.post(http + '/checkanswer', {
    resultID: resultData.result_id,
    data: JSON.stringify(resultData.data)
  }, function(result) {
    console.log(result)
    isSubmit = false;
    $('.schedule').hide();
    $('#textScore').text(result.defeat)
    $('#user_number').text(resultData.result_id)
    $('#pmsNum').text(result.pm)
    if(result.pm <= 100 && result.defeat == '100%') {
      $('.maskBox').css('display','flex');
      $('.rankingNum').text(resultData.defeat);
    }
    answerBox.hide();
    resultBox.show();
    yhq_id = result.yhq_id;
    createPoster(result.lev,result.defeat)
  });
}
