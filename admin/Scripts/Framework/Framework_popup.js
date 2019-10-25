(function ($) {
    function Popup($el) {
        this.$el = $el;
    }
    Popup.prototype = {
        constructor: Popup,

        init: function (options) {
            var html = ['<input textfield readonly type="textbox" class="input-text ' + (options.validate?"easyui-validatebox":"") + '" style="width: 129px; height: 20px;"><a href="javascript:void(0)" popup="true" class="textbox-icon combo-arrow" icon-index="0" tabindex="-1" style="width: 18px; height: 20px;"></a>'];
            this.options = options;
            if (this.options.clearButton) html.push('<a href="javascript:void(0)" cleared="true" class="textbox-icon combo-arrow" icon-index="0" tabindex="-1" style="width: 18px; height: 20px;"></a>');
            html.push('<input type="hidden" valuefield class="textbox-value" name="' + this.$el.id + '"></input>');
            this.$el.append(html.join(''));
            this.$el.css('width', this.options.width + 'px');
            this.events();
        },
        events: function () {
            this.$el.find('a[popup]').click($.proxy(this, 'popup'));
            this.$el.find('a[cleared]').click($.proxy(this, 'clearInput'));
        },

        popup: function (event) {
            alert(event);

            this.$el.find('input[textfield]').val("this is text");
            this.$el.find('input[valuefield]').val("this is value field");
            this.options.onPopup();
        },

        clearInput: function (event) {
            //var $this = $(event.target);
            //this.options.onSelect($this.data('name'));
            //var option = eval('(' + $this.data('name') + ')');
            this.options.onClear();
        }
    };
    $.fn.popupSelect = function () {
        var option = arguments[0],
			args = arguments,
			value,
			allowedMethods = [];
        
        this.each(function () {
            //alert($(this).attr['popup-option']);
            //var toption = option || this['popup-option'];
            var $this = $(this),data = $this.data('popupSelect'),
				options = $.extend({}, $.fn.popupSelect.defaults, typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }
                value = data[option](args[1]);
            } else {
                if (!data) {
                    data = new Popup($this);
                    data.init(options, true);
                    $this.data('popupSelect', data);
                } else {
                    data.init(options);
                }
            }
        });
        return value ? value : this;
    };

    $.fn.popupSelect.defaults = {
        width: 120,
        clearButton: true,
        data: [],
        onPopup: function (index) { return false; },
        onClear: function (name) { return false; }
    };
})(jQuery);