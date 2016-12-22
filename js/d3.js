(function ($) {

	if (typeof $.esmool == 'undefined')
		$.esmool = {};

	$.esmool.d3 = {};

	$.esmool.d3.AXIS = {
		x: true,
		y: true,
		z: true
	};

	var D2_TO_D3_MAP = {
		'x': { 'X': 'y', 'Y': 'z' },
		'y': { 'X': 'z', 'Y': 'x' },
		'z': { 'X': 'x', 'Y': 'y' }
	};

	$.esmool.d3.getD2AxisD3Name = function (d2Axis, normal) {
		return D2_TO_D3_MAP[normal][d2Axis];
	};

})(jQuery);