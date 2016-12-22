(function ($) {

	if (typeof $.esmool == 'undefined')
		$.esmool = {};

	$.esmool.selector = {};

	$.esmool.selector.LETTERS = {
		'R': { axis: 'x', value: 0 },
		'L': { axis: 'x', value: 2 },
		'U': { axis: 'z', value: 0 },
		'D': { axis: 'z', value: 2 },
		'F': { axis: 'y', value: 0 },
		'B': { axis: 'y', value: 2 }
	};

	$.esmool.selector.select = function (cube, expression) {
		var selectee = function (letter) {
			var LTR = $.esmool.selector.LETTERS[letter];
			return cube.bMaps[LTR.axis][LTR.value];
		};

		var getNot = function (set) {
			return $.esmool.sets.sub(cube.bMaps.all, set);
		};

		return $.esmool.expression.evaluate(expression, {
			'R': function () { return selectee('R'); },
			'L': function () { return selectee('L'); },
			'U': function () { return selectee('U'); },
			'D': function () { return selectee('D'); },
			'F': function () { return selectee('F'); },
			'B': function () { return selectee('B'); },
			'+': function (children, evaluator) {
				var v0 = evaluator(children[0]);
				var v1 = evaluator(children[1]);
				return $.esmool.sets.union(v0, v1);
			},
			'*': function (children, evaluator) {
				var v0 = evaluator(children[0]);
				var v1 = evaluator(children[1]);
				return $.esmool.sets.intersect(v0, v1);
			},
			'!': function (children, evaluator) {
				var child = children[0];
				var childResult = child.type == 'chr' ? selectee(child.char) : evaluator(child);
				return getNot(childResult);
			}
		});
	};

})(jQuery);