

jQuery(document).ready(function ($) {
	
	$('#adminqs').searchAhead();

});

(function ($) {
	
	var SearchAhead = function (options) {
		this.$input = options.input;
		this.url = options.url;
		this.oldVal = '--';
		this.appended = false;
		this.showing = false;
		this.$active = false;
		this.$list;
		this.initialize();
	}
	SearchAhead.prototype = {

		initialize: function () {
			this.$input
				.on('focus', $.proxy(this.activate, this))
				.on('keyup', $.proxy(this.change, this))
				.on('blur', $.proxy(this.destroy, this));
		},
		// on focus callback
		activate: function () {
			$(window).on('keyup.saList', $.proxy(this.navigate, this));
			if (this.appended) return;
			this.$list = $('<ul class="adminqs-list ab-submenu"></ul>');
			this.$list
				.insertAfter(this.$input.parent())
				.wrap('<div class="ab-sub-wrapper"></div>')
				.parent().hide();
			this.appended = true;
		},
		// on blur callback
		destroy: function () {
			var self = this;
			$(window).off('keyup.saList')
			window.setTimeout(function () {
				self.$list.parent().hide();
				self.showing = false;
				self.$active = false;
			}, 125);
		},
		navigate: function (e) {
			console.log(e.keyCode)
			if (!this.showing) return;
			var kids = this.$list.children();
			switch (e.keyCode) {
				case 27: // esc
					this.destroy();
					break;
				case 38: // up
					e.preventDefault();
					this.prev();
					break;
				case 40: // down
					e.preventDefault();	
					this.next();
					break;
				case 13: // enter
					e.preventDefault();
					if (this.$active)
						window.location.href = this.$active.children('a').attr('href');
					break;
				default:
			}
		},
		prev: function () {
			var prev = this.$active ? this.$active.prev() : '';
			
			if (!prev.length)
				prev = this.$list.children().last();
			
			this.$active && this.$active.removeClass('active');
			prev.addClass('active');
			this.$active = prev;
		},
		next: function () {
			var next = this.$active ? this.$active.next() : '';
			
			if (!next.length)
				next = this.$list.children().first();
			
			this.$active && this.$active.removeClass('active');
			next.addClass('active');
			this.$active = next;
		},
		// on keyup callback
		change: function (e) {
			var val = $(e.currentTarget).val();
			if ( val.length < 2 || val.length === this.oldVal.length ) return;
			this.showing = true;
			this.$active = false;
			this.oldVal = val;
			this.$list.parent().show();
			this.fetch(val);
		},
		fetch: function (val) {
			$.ajax({
				type: 'GET',
				url: this.url,
				data: {s: val, json: true}
			}).done($.proxy(this.render, this)).fail(this.fail);
		},
		render: function (data) {
			var itemli = function (obj) {
				return '<li><a class="ab-item" href="'+ obj.link +'">'+ obj.title +'</a></li>';
			};
			var items = '';

			data = JSON.parse(data);

			if ( !data.length )
				items = itemli({title: 'No items found', link: 'javascript:void(0)'});
			else
				$.each(data, function (index, elem) { items += itemli(elem); });

			this.$list.html(items);
		},
		fail: function (a,b,c) {
			console.log(a,b,c);
		}

	}

	$.fn.searchAhead = function (options) {
		var options = options || null;
		var data = $(this).data('searchAhead');
		// if data exists (has been instantiated) and calling a public method
		if (data && typeof options == 'string' && data[options]) {
			return data[options]();
		// if no data, then instantiate
		} else if (!data) {
			var defaults = {
				url: window.location.origin
			}; 

			var options = $.extend(defaults, options);  				
			return this.each(function () {  
				options.input = $(this);
				$(this).data('searchAhead', new SearchAhead(options));
			});
		// else, throw jquery error
		} else {
			$.error( 'Method "' +  option + '" does not exist in SearchAhead!');
		}  
	};
	
})(jQuery);
