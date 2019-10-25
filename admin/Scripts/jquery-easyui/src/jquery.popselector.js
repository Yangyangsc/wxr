/**
 * datebox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 calendar
 *   combo
 * 
 */
(function($){
	/**
	 * create popselector
	 */
	function createBox(target){
		var state = $.data(target, 'popselector');
		var opts = state.options;
		
		$(target).addClass('datebox-f').combo($.extend({}, opts, {
			onShowPanel:function(){
				setCalendar();
				setValue(target, $(target).datebox('getText'));
				opts.onShowPanel.call(target);
			}
		}));
		$(target).combo('textbox').parent().addClass('datebox');
		
		/**
		 * if the calendar isn't created, create it.
		 */
		if (!state.calendar){
			createCalendar();
		}
		
		function createCalendar(){
			var panel = $(target).combo('panel').css('overflow','hidden');
			var cc = $('<div class="datebox-calendar-inner"></div>').appendTo(panel);
			if (opts.sharedCalendar){
				state.calendar = $(opts.sharedCalendar).appendTo(cc);
				if (!state.calendar.hasClass('calendar')){
					state.calendar.calendar();
				}
			} else {
				state.calendar = $('<div></div>').appendTo(cc).calendar();
			}
			$.extend(state.calendar.calendar('options'), {
				fit:true,
				border:false,
				onSelect:function(date){
					var opts = $(this.target).datebox('options');
					setValue(this.target, opts.formatter(date));
					$(this.target).combo('hidePanel');
					opts.onSelect.call(target, date);
				}
			});
			setValue(target, opts.value);
			
			var button = $('<div class="datebox-button"><table cellspacing="0" cellpadding="0" style="width:100%"><tr></tr></table></div>').appendTo(panel);
			var tr = button.find('tr');
			for(var i=0; i<opts.buttons.length; i++){
				var td = $('<td></td>').appendTo(tr);
				var btn = opts.buttons[i];
				var t = $('<a href="javascript:void(0)"></a>').html($.isFunction(btn.text) ? btn.text(target) : btn.text).appendTo(td);
				t.bind('click', {target: target, handler: btn.handler}, function(e){
					e.data.handler.call(this, e.data.target);
				});
			}
			tr.find('td').css('width', (100/opts.buttons.length)+'%');
		}
		
		function setCalendar(){
			var panel = $(target).combo('panel');
			var cc = panel.children('div.datebox-calendar-inner');
			panel.children()._outerWidth(panel.width());
			state.calendar.appendTo(cc);
			state.calendar[0].target = target;
			if (opts.panelHeight != 'auto'){
				var height = panel.height();
				panel.children().not(cc).each(function(){
					height -= $(this).outerHeight();
				});
				cc._outerHeight(height);
			}
			state.calendar.calendar('resize');
		}
	}
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q);
	}
	function setValue(target, value){
		var state = $.data(target, 'popselector');
		var opts = state.options;
		$(target).combo('setValue', value).combo('setText', value);
	}
	
	$.fn.popselector= function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.popselector.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'popselector');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'popselector', {
					options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	};
	
	$.fn.datebox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'popselector').options, {
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		calendar: function(jq){	// get the calendar object
			return $.data(jq[0], 'datebox').calendar;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).datebox('options');
				$(this).datebox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.popselector.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target, ['sharedCalendar']));
	};
	
	$.fn.popselector.defaults = $.extend({}, $.fn.combo.defaults, {
		panelWidth:480,
		panelHeight:'auto',
		selectType:'user',
		allowClear:true,
		filter:'',
		mutilSelect:false,
		onSelect:function(data){}
		onClear:function(){}
	});
})(jQuery);
