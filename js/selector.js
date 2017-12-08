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

	$.esmool.selector.select = (cube, expression) => {
		var selectee = letter => {
			var LTR = $.esmool.selector.LETTERS[letter];
			return cube.bMaps[LTR.axis][LTR.value];
		};

		var getNot = set => $.esmool.sets.sub(cube.bMaps.all, set);

		return $.esmool.expression.evaluate(expression, {
			'R': () => selectee('R'),
			'L': () => selectee('L'),
			'U': () => selectee('U'),
			'D': () => selectee('D'),
			'F': () => selectee('F'),
			'B': () => selectee('B'),
			'+': (children, evaluator) =>
				$.esmool.sets.union(
					evaluator(children[0]),
					evaluator(children[1])
				),
			'*': (children, evaluator) =>
				$.esmool.sets.intersect(
					evaluator(children[0]),
					evaluator(children[1])
				),
			'!': (children, evaluator) => {
				var child = children[0];
				var childResult = child.type == 'chr' ? selectee(child.char) : evaluator(child);
				return getNot(childResult);
			}
		});
	};

})(jQuery);