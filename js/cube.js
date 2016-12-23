(function ($) {

	if (typeof $.esmool == 'undefined')
		$.esmool = {};

	$.esmool.cube = {};

	$.esmool.cube.create = function () {
		var bSuit = createBlocks();
		var fSuit = createFaces();
		var maps = createBridgeMaps(bSuit, fSuit);

		return {
			blocks: bSuit.blocks,
			faces: fSuit.faces,
			bMaps: bSuit.maps,
			fMaps: fSuit.maps,
			b2fMaps: maps.b2fMaps,
			f2bMap: maps.f2bMap
		};
	};

	function createBlocks() {
		var blocks = {};
		for (x=0; x<3; x++) {
			for (y=0; y<3; y++) {
				for (z=0; z<3; z++) {
					var block = $.esmool.block.create(x, y, z);
					blocks[block.id] = block;
				}
			}
		}

		var maps = $.esmool.block.createMaps(blocks);

		return {
			blocks: blocks,
			maps: maps
		};
	}

	function createFaces() {
		var faces = {};

		for (var a in $.esmool.d3.AXIS) {
			for (var f in $.esmool.face.SIDES) {
				for (var X=0; X<3; X++) {
					for (var Y=0; Y<3; Y++) {
						var face = $.esmool.face.create(a, f, X, Y);
						faces[face.id] = face;
					}
				}
			}
		}

		var maps = $.esmool.face.createMaps(faces);

		return {
			faces: faces,
			maps: maps
		};
	}

	function createBridgeMaps(blockSuit, faceSuit) {
		var faces = faceSuit.faces;
		var blocks = blockSuit.blocks;
		var fMaps = faceSuit.maps;
		var bMaps = blockSuit.maps;

		var b2fMaps = {};
		var f2bMap = {};

		var checkMap = function (m, src) {
			if (!m[src])
				m[src] = {};
			return m[src];
		};

		var getFirstKey = function (obj) {
			var tmp = null;
			for (var k in obj) {
				tmp = k;
				break;
			}
			return tmp;
		};

		for (var k in faces) {
			var f = faces[k];

			var axis = f.axis;
			var aCoord = $.esmool.face.SIDES[f.side];

			var d3XName = $.esmool.d3.getD2AxisD3Name('X', axis);
			var d3YName = $.esmool.d3.getD2AxisD3Name('Y', axis);
			var d3XValue = f[d3XName];
			var d3YValue = f[d3YName];

			var bIds = $.esmool.sets.intersect(bMaps[axis][aCoord], bMaps[d3XName][d3XValue], bMaps[d3YName][d3YValue]);
			var bId = getFirstKey(bIds);

			f2bMap[f.id] = bId;

			var b2fMap = checkMap(b2fMaps, bId);
			b2fMap[f.id] = true;
		}

		return {
			b2fMaps: b2fMaps,
			f2bMap: f2bMap
		};
	}

	$.esmool.cube.draw = function (canvas, cube, selections, center, units) {
		// TODO: 这里还是要仔细检查一下的好
		var gethorFunc = function (selection) {
			for (var bId in blocks) {
				var b = blocks[bId];
				var bFaces = cube.b2fMaps[bId];
				var selected = !!selection[bId];

				if (!bFaces || !Object.keys(bFaces).length)
					continue;

				for (var fId in bFaces) {
					var f = faces[fId];
					var p = $.esmool.face.getPiece(f);
					pieces.push({ piece: p, selected: selected, selection.color });
				}
			}
		};

		var blocks = cube.blocks;
		var faces = cube.faces;
		var pieces = [];

		for (var k in selections)
			gethorFunc(selections[k]);

		canvas.clear();
		for (var i=0; i<pieces.length; i++) {
			var p = pieces[i];
			$.esmool.svgkit.drawPiece(canvas, p.piece, {
				stroke: 'black',
				fill: !p.selected ? 'white' : p.color
			}, center, units);
		}
	};

})(jQuery);