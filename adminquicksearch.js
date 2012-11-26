

var adminqs = {};

jQuery(document).ready(function ($) {	
	
	var container = $('#wp-admin-bar-admin-quick-search').children('.ab-item');
	var input = $('#adminqs');
	var searchUrl = window.location.origin + '/'
	var oldVal = '--', val = '';
	var appended, items, $list;
	
	var list = adminqs.tpl('<ul class="adminqs-list"></ul>');
	var itemli = adminqs.tpl('<li><a href="<%= link %>"><%= title %></a></li>');
		
	input.on('focus', function () {
		console.log('here');
		if (appended) return;
		container.append(list());
		$list = $('.adminqs-list');
		$list.hide();
		appended = true;
		
	}).on('blur', function () {
		
		$list.remove();
		appended = false;
		
	}).on('keyup', function () {
		
		val = $(this).val();
		
		if ( val.length < 3 || val.length < oldVal.length + 2 ) return;
		
		oldVal = val;
		$list.show();
		
		$.ajax({
			type: 'GET',
			url: searchUrl,
			data: {s: val, json: true}
		}).done(function (data) {
			
			data = JSON.parse(data);
			$list.empty();
			items = '';
			
			if ( !data.length ) {
				items = '<li><a href="">No items found</a></li>';
			} else {
				$.each(data, function (index, elem) { items += itemli(elem); });
			}
			
			$list.html(items);
			
		}).fail(function (a,b,c) {
			
			console.log(a,b,c);
			
		});
		
	});


});
	

(function ($) {
	
	// When customizing `templateSettings`, if you don't want to define an
	// interpolation, evaluation or escaping regex, we need one that is
	// guaranteed not to match.
	var noMatch = /(.)^/;

	// Certain characters need to be escaped so that they can be put into a
	// string literal.
	var escapes = {
		"'":      "'",
		'\\':     '\\',
		'\r':     'r',
		'\n':     'n',
		'\t':     't',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
	
	// JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	adminqs.tpl = function(text, data) {

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = new RegExp([
	      (/<%-([\s\S]+?)%>/g).source,
	      (/<%=([\s\S]+?)%>/g).source,
	      (/<%([\s\S]+?)%>/g).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset)
	        .replace(escaper, function(match) { return '\\' + escapes[match]; });
	      source +=
	        escape ? "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" :
	        interpolate ? "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" :
	        evaluate ? "';\n" + evaluate + "\n__p+='" : '';
	      index = offset + match.length;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + "return __p;\n";

	    try {
	      var render = new Function('obj', 'adminqs', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    if (data) return render(data, adminqs);
	    var template = function(data) {
	      return render.call(this, data, adminqs);
	    };

	    // Provide the compiled function source as a convenience for precompilation.
	    template.source = 'function(' + ('obj') + '){\n' + source + '}';

	    return template;
	  };
	
	
})(jQuery);
