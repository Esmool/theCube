(function ($) {

	if (typeof $.esmool == 'undefined')
		$.esmool = {};

	$.esmool.block = {};

	$.esmool.block.create = (x, y, z) => { return {
		id: Math.uuid(),
		x: x,
		y: y,
		z: z
	}; };

	$.esmool.block.createMaps = blocks => {
		var maps = {};
		maps.all = {};

		var checkMap = (m, source) => {
			if (!m[source])
				m[source] = {};
			return m[source];
		};

		var mapper = (axis, block) => {
			var coord = block[axis];
			var map = checkMap(maps, axis);
			var set = checkMap(map, coord);
			set[block.id] = true;
		};

		for (var k in blocks) {
			var b = blocks[k];
			mapper('x', b);
			mapper('y', b);
			mapper('z', b);
			maps.all[b.id] = true;
		}

		return maps;
	};

})(jQuery);