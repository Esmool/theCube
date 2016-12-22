(function ($) {

	if (typeof $.esmool == 'undefined')
		$.esmool = {};

	$.esmool.face = {};

	$.esmool.face.SIDES = {
		FRONT : 0,
		BACK  : 2
	};

	$.esmool.face.SIDE_OFFSETS = {
		FRONT : 0,
		BACK  : 7
	};

	var R3P2 = Math.sqrt(3)/2.0, P2 = 1/2.0;

	$.esmool.face.SHAPES = {
		'x': [
			{ X:     0, Y: - 1 },
			{ X:  R3P2, Y:  P2 },
			{ X:     0, Y:   1 },
			{ X: -R3P2, Y: -P2 }
		],
		'y': [
			{ X: -R3P2, Y:  P2 },
			{ X:     0, Y: - 1 },
			{ X:  R3P2, Y: -P2 },
			{ X:     0, Y:   1 }
		],
		'z': [
			{ X:  R3P2, Y:  P2 },
			{ X: -R3P2, Y:  P2 },
			{ X: -R3P2, Y: -P2 },
			{ X:  R3P2, Y: -P2 }
		]
	};

	$.esmool.face.UNITS = {
		'x': { X: -R3P2, Y:  P2 },
		'y': { X:  R3P2, Y:  P2 },
		'z': { X:     0, Y: - 1 }
	};

	var vec_multiple = function (V, k) {
		return { X: V.X * k, Y : V.Y * k };
	};

	var vec_add = function (V, ...args) {
		var add = function (v, w) {
			return { X: v.X + w.X, Y: v.Y + w.Y };
		};

		var A = V;
		for (var i=0; i<args.length; i++)
			A = add(A, args[i]);
		return A;
	};

	$.esmool.face.create = function (axis, side, X, Y) {
		var d3XName = $.esmool.d3.getD2AxisD3Name('X', axis);
		var d3YName = $.esmool.d3.getD2AxisD3Name('Y', axis);

		var obj = {
			id: Math.uuid(),
			axis: axis,
			side: side,
		};

		obj[d3XName] = X;
		obj[d3YName] = Y;

		return obj;
	};

	$.esmool.face.createMaps = function (faces) {
		var maps = {};
		maps.all = {};

		var checkMap = function (m, source) {
			if (!m[source])
				m[source] = {};
			return m[source];
		};

		var mapper = function (face) {
			var d3XName = $.esmool.d3.getD2AxisD3Name('X', face.axis);
			var d3YName = $.esmool.d3.getD2AxisD3Name('Y', face.axis);
			var aMaps = checkMap(maps, face.axis);
			var sMaps = checkMap(aMaps, face.side);
			var xMap = checkMap(sMaps, d3XName);
			var yMap = checkMap(sMaps, d3YName);
			var xSet = checkMap(xMap, face[d3XName]);
			var ySet = checkMap(yMap, face[d3YName]);
			xSet[face.id] = true;
			ySet[face.id] = true;
		};

		for (var k in faces) {
			var f = faces[k];
			mapper(f);
			maps.all[f.id] = true;
		}

		return maps;
	};

	var getStartPoint = function (face) {
		var axis = face.axis;
		var d3XName = $.esmool.d3.getD2AxisD3Name('X', axis);
		var d3YName = $.esmool.d3.getD2AxisD3Name('Y', axis);

		var d3XValue = face[d3XName];
		var d3YValue = face[d3YName];
		var d3ZValue = $.esmool.face.SIDE_OFFSETS[face.side];

		var d3XUnit = $.esmool.face.UNITS[d3XName];
		var d3YUnit = $.esmool.face.UNITS[d3YName];
		var d3ZUnit = $.esmool.face.UNITS[axis];

		var d3XOffset = vec_multiple(d3XUnit, d3XValue);
		var d3YOffset = vec_multiple(d3YUnit, d3YValue);
		var d3ZOffset = vec_multiple(d3ZUnit, d3ZValue);

		return vec_add(d3XOffset, d3YOffset, d3ZOffset);
	};

	var copy = function (obj) {
		var json = JSON.stringify(obj);
		return JSON.parse(json);
	};

	$.esmool.face.getPiece = function (face) {
		var axis = face.axis;

		return {
			startPoint: getStartPoint(face),
			path: copy($.esmool.face.SHAPES[axis])
		};
	};

})(jQuery);