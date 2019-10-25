function initFontsize() {
  document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 375 * 14 + 'px';
}

function initPage2() {
  initFontsize();
  var $money = document.querySelector('.paper_btn3')
  var $close = document.querySelector('.modal__close')
  var $modal = document.querySelector('.modal')

  $money.addEventListener('click', function () {
    if ($modal.className.indexOf(/hide/)) {
      $modal.className = $modal.className.replace(/hide/, '')
    }
  })
  $close.addEventListener('click', function () {
    $modal.className = $modal.className.replace(/\s$/, ' hide')
  })
}

function initProgress(options) {
  initFontsize();
  options = options || {}
  var $number = document.querySelector('.loading__number')
  var $progress = document.querySelector('.loading__progress')
  var percent = 0
  var speed = 100
  if (options.speed) {
    speed = options.speed
  }
  var timer = setInterval(progressing, speed)
  var img = new Image()
  img.addEventListener('load', function (progress) {
    $number.innerText = '100%'
    $progress.style.width = '100%'
    if (options.complete) {
      options.complete()
    }
  })

  function progressing() {
    if (percent > 90) {
      clearInterval(timer)
      img.src = '../images/bg2.jpg'
    } else {
      percent++
      $number.innerText = percent + '%'
      $progress.style.width = percent + '%'
    }
  }
}

function initPage1() {
  initFontsize();
  var $peking = document.querySelector('.peking')
  var $img1 = document.querySelector('.image__peking')
  var $img2 = document.querySelector('.peking__right')
  var $title = document.querySelector('.image__title')
  var $text = document.querySelector('.image__text')
  var $items = document.querySelectorAll('.form_item')
  var loaded = 0
  $img1.addEventListener('load', function () {
    loaded++;
    if (loaded == 2) {
      animated();
    }
  })
  $img2.addEventListener('load', function () {
    loaded++;
    if (loaded == 2) {
      animated();
    }
  })

  function animated() {
    setTimeout(function () {
      $peking.className = $peking.className + ' animated';
      $title.className = $title.className + ' animated';
      $text.className = $text.className + ' animated';
      [].forEach.call($items, function (element, index) {
        element.className = element.className + ' animated'
      });
    }, 1000)
  }
}

