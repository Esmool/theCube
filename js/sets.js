(function ($) {

	if (typeof $.esmool == 'undefined')
		$.esmool = {};

	$.esmool.sets = {};

	var mulitpleKit = (a, bs, f) => {
		var A = a;
		for (var i=0; i<bs.length; i++)
			A = f(A, bs[i]);
		return A;
	};

	$.esmool.sets.union = (a, ...bs) => {
		return mulitpleKit(a, bs, (x, y) => {
			var s = {};

			for (var k in x)
				s[k] = true;

			for (var k in y)
				s[k] = true;

			return s;
		});
	};

	$.esmool.sets.intersect = (a, ...bs) => {
		return mulitpleKit(a, bs, (x, y) => {
			var s = {};

			for (var k in x) {
				if (!y[k])
					continue;

				s[k] = true;
			}

			return s;
		});
	};

	$.esmool.sets.sub = (a, ...bs) => {
		return mulitpleKit(a, bs, (x, y) => {
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