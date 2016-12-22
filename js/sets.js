(function ($) {

	if (typeof $.esmool == 'undefined')
		$.esmool = {};

	$.esmool.sets = {};

	var mulitpleKit = function (a, bs, f) {
		var A = a;
		for (var i=0; i<bs.length; i++)
			A = f(A, bs[i]);
		return A;
	};

	$.esmool.sets.union = function (a, ...bs) {
		return mulitpleKit(a, bs, function (x, y) {
			var s = {};

			for (var k in x)
				s[k] = true;

			for (var k in y)
				s[k] = true;

			return s;
		});
	};

	$.esmool.sets.intersect = function (a, ...bs) {
		return mulitpleKit(a, bs, function (x, y) {
			var s = {};

			for (var k in x) {
				if (!y[k])
					continue;

				s[k] = true;
			}

			return s;
		});
	};

	$.esmool.sets.sub = function (a, ...bs) {
		return mulitpleKit(a, bs, function (x, y) {
			var s = {};

			for (var k in x) {
				if (!!y[k])
					continue;

				s[k] = true;
			}

			return s;
		});
	};

})(jQuery);