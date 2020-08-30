(function () {
    Selectize.define('clear_button', function (options) {
        /**
         * Escapes a string for use within HTML.
         *
         * @param {string} str
         * @returns {string}
         */
        var escape_html = function (str) {
            return (str + '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        };

        options = $.extend({
            className: 'clearAll',
            append: true,
            hideWhenEmpty: true,
            leaveOpen: false
        }, options);

        var self = this,
        $html = $('<svg class="' +
            options.className +
            ' width="22" height="22" stroke="#97a4b1"><use xlink:href="/assets/icons/symbols.svg#x-circle" xmlns:xlink="http://www.w3.org/1999/xlink"></use></svg>');


        this.setup = (function () {
            var original = self.setup;
            return function () {
                // override the item rendering method to add the button to each
                original.apply(this, arguments);

                this.$wrapper.append($html);

                if (options.hideWhenEmpty) {
                    var $input = this.$input;
                    var hideShowClrBtn = function ($inpt) {
                        var val = $inpt.val();
                        if (val) {
                            $html.show();
                        } else {
                            $html.hide();
                        }
                    };

                    hideShowClrBtn($input);
                    $input.change(function () {
                        hideShowClrBtn($input);
                    });
                }

                // add event listener
                this.$wrapper.on('click', '.' + options.className, function (e) {
                    e.preventDefault();
                    if (self.isLocked) return;
                    self.clear();
                    if (options.leaveOpen) {
                        self.$control_input.focus();
                    }
                });
            };
        })();
    });


    Selectize.define('enter_key_submit', function (options) {
        var self = this;
    
        this.onKeyDown = (function (e) {
          var original = self.onKeyDown;
    
          return function (e) {
            var initialSelection = this.items.length;
            original.apply(this, arguments);
    
            if (e.keyCode === 13 && initialSelection && initialSelection === this.items.length && this.$control_input.val() === '') {
              self.trigger('submit');
            }
          };
        })();
    });
    


    Selectize.define('typing_mode', function(options) {
        var self = this;

        this.setup = (function() {
            var original = self.setup;
            self.updating = false;

            return function() {
                original.apply(this, arguments);
                
                var thisPlaceHolder = self.settings.placeholder;

                this.on('dropdown_open', function() {
                    self.previousValue = self.getValue();
                    var option = self.getOption(self.previousValue);

                    /**
                     * Two styles: 
                     *     1) usePlaceholder gives an immediately blank field to type into
                     *     2) default shows the text and allows user to edit last selection
                     */
                    
                    self.$control_input.css({
                        "flex-grow": '1',
                    });
                    self.$control.find('.item').hide();

                    //self.items = [];
                    self.setValue('');
                    self.setCaret(0);

                    if (self.settings.usePlaceholder) {
                        self.$control_input.attr('placeholder', option.text().trim());
                    } else {
                        self.$control_input.attr('value', option.text().trim());
                    }
                });

                var thisForm = self.$control.closest('form');

                this.$control_input.on('blur', function() {

                    thisForm.on('submit.typing', function(event){
                        event.preventDefault();
                        thisForm.off('submit.typing');
                    });

                    self.$control_input.attr('placeholder', thisPlaceHolder);

                    self.$control.find('.item').show();

                    /**
                     * Use the current value, or, if empty, set to the previous value
                     */
                    var value = self.getValue() || self.previousValue;

                    /**
                     * Avoid infinite loop. self.setValue calls blur() again
                     *     even if we pass true to the second param.
                     */
                    if (self.updating)
                            return;
                    
                    self.updating = true;
                    self.setValue(value);
                    self.updating = false;
                });
            };
        })();
    });


})();