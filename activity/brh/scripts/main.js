$(function(){
  document.querySelector('html').style.fontSize = (window.innerWidth / 320 * 12) + 'px';

  // 智库 了解详情
  $('.zhiku__item').each(function(index, item){
    var $item = $(item)
    var $viewBtn = $item.find('.zhiku-btn__more')
    var $dialog = $item.find('.zhiku_dialog')
    var $close = $dialog.find('.close')
    var $mask = $item.find('.weui-mask')
    var $contactBtn = $dialog.find('.btn-contact')
    $viewBtn.click(function(){
      $dialog.addClass('show')
    })

    $close.add($mask).add($contactBtn).click(function(){
      $dialog.removeClass('show')
    })
  })

  // 媒体库 tab切换
  var $tabs = $('.media-container .weui-navbar__item')
  var $tab_panels = $('.media-container .media-tab__panel')
  $tabs.click(function(){
    var index = $(this).index()
    if($(this).hasClass('weui-bar__item_on')) {
      return false
    }else{
      $tab_panels.eq(index).addClass('show').siblings().removeClass('show')
      $(this).addClass('weui-bar__item_on').siblings().removeClass('weui-bar__item_on')
    }
  })
})

