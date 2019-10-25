$(function(){
  // menu dropdown
  var $dropdown = $(".dropdown")
	$dropdown.on({
		"mouseenter": function(){
			$(this).addClass("open")
		},
		"mouseleave": function(){
			$(this).removeClass("open")
		}
	})

  // left menu panel
  var activeIndex = $('.left-menu-panel .list-group .list-group-item.active').index()
  $('.left-menu-panel .list-group .list-group-item').on({
    'mouseenter': function(){
      $(this).addClass('active').siblings().removeClass('active')
    },
    'mouseleave': function(){
      $(this).removeClass('active')
      $('.left-menu-panel .list-group .list-group-item').eq(activeIndex).addClass('active')
    }
  })
})