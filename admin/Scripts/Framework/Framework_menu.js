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
				var html = [];
				//html.push('<div title="'+item.name+'">');
				if (item.children && item.children.length) {
					
					html.push('<ul class="easyui-datalist" data-options="border:false,fit:true">');
					$.each(item.children || [], function(i, c) {
						html.push(
							'<li>',
                                '<a onclick="menuClick(this)"  data-name="{title:\'' + c.name + '\',url:\'' + c.url + '\',target:\''+c.target+'\'}" href="#">',
									c.name,
								'</a>',
							'</li>'
						);
					});
					html.push('</ul>');
				}
				$('#menu').accordion('add', {
                                title: item.name,
                                content: html.join(''),
                                selected: false
                            });
				//html.push('</div>');
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

	$.fn.bootstrapMenu = function() {
		var option = arguments[0], 
			args = arguments,
			
			value, 
			allowedMethods = [];
		this.each(function() {
			var $this = $(this), 
				data = $this.data('bootstrapMenu'), 
				options = $.extend({}, $.fn.bootstrapMenu.defaults, typeof option === 'object' && option);

			if (typeof option === 'string') {
				if ($.inArray(option, allowedMethods) < 0) {
					throw "Unknown method: " + option;
				}
				value = data[option](args[1]);
			} else {
				if (!data) {
					data = new Menu($this);
					data.init(options, true);
					$this.data('bootstrapMenu', data);
				} else {
					data.init(options);
				}
			}
		});
		
		return value ? value : this;
	};
	
	$.fn.bootstrapMenu.defaults = {
		width: 180,
		isOpen: false,
		data: [],
		onToggle: function(index) { return false; },
		onSelect: function(name) { return false; }
	};
})(jQuery);