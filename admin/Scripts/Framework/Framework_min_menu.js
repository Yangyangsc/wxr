/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * @version 0.0.1
 * @github https://github.com/wenzhixin/bootstrap-menu
 * @blog http://wenzhixin.net.cn
 */

(function($) {
			
	'use strict';

	function Menu($el) {
		this.$el = $el;
	}
    
	Menu.prototype = {
		constructor: Menu,
		
		init: function(options) {
			this.options = options;
			$.each(this.options.data, function(i, item) {
				var html = '<li onclick="openMenu('+i+')" style="text-align:center"><img src="'+urlConfig.base.imageBase+ item.icon+'" style="width:24px"><p>'+item.name+'</p></li>';
				$('#minMenu').datalist('appendRow', {text:html});
			});
			//this.$el.append(html.join(''));
			//this.events();
		},
		events: function() {
			//this.$el.find('a[data-name]').click($.proxy(this, 'select'));
			this.$el.find('a[data-name]').click($.proxy(this, 'select'));
		},
		select: function(event) {
			var $this = $(event.target);
		    //this.options.onSelect($this.data('name'));
			var option = eval('(' + $this.data('name') + ')');
			this.options.onSelect(option);
		}
	};

	$.fn.minMenu = function() {
		var option = arguments[0], 
			args = arguments,
			
			value, 
			allowedMethods = [];
		this.each(function() {
			var $this = $(this), 
				data = $this.data('minMenu'), 
				options = $.extend({}, $.fn.minMenu.defaults, typeof option === 'object' && option);

			if (typeof option === 'string') {
				if ($.inArray(option, allowedMethods) < 0) {
					throw "Unknown method: " + option;
				}
				value = data[option](args[1]);
			} else {
				if (!data) {
					data = new Menu($this);
					data.init(options, true);
					$this.data('minMenu', data);
				} else {
					data.init(options);
				}
			}
		});
		
		return value ? value : this;
	};
	
	$.fn.minMenu.defaults = {
		width: 70,
		isOpen: false,
		data: [],
		onToggle: function(index) { return false; },
		onSelect: function(name) { return false; }
	};
})(jQuery);