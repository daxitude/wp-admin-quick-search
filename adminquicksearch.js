

jQuery(document).ready(function ($) {
	
	$('#adminqs').searchAhead();

});

(function ($) {
	
	var SearchAhead = function (options) {
		this.$input = options.input;
		this.url = options.url;
		this.oldVal = '--';
		this.appended = false;
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
			if (this.appended) return;
			this.$list = $('<ul class="adminqs-list ab-submenu"></ul>');
			this.$list.insertAfter(this.$input.parent()).wrap('<div class="ab-sub-wrapper"></div>').parent().hide();
			this.appended = true;
		},
		// on blur callback
		destroy: function () {
			var self = this;
			window.setTimeout(function () {
				self.$list.parent().hide();
			}, 125);
		},
		// on keyup callback
		change: function (e) {
			var val = $(e.currentTarget).val();
			if ( val.length < 2 ) return;	
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
				items = itemli({title: 'No items found'});
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
