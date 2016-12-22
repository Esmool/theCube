(function ($) {

    if (typeof $.esmool == 'undefined')
        $.esmool = {};

    $.esmool.svgkit = {};

    var parameter = {};

    var pathBuilder = function () {
        var path = [];
        var builder = {};

        builder.M = function (P) {
            path.push('M' + P.X + ',' + P.Y);
            return builder;
        };

        builder.l = function (P) {
            path.push('l' + P.X + ',' + P.Y);
            return builder;
        };

        builder.Z = function (P) {
            path.push('Z');
            return builder;
        };

        builder.build = function () {
            return path.join('');
        }

        return builder;
    };

    $.esmool.svgkit.drawPiece = function (svg, path, options, offset, units) {
        var mapPoint = function (p) {
            return {
                X: p.X * units.Ex + offset.Xg,
                Y: p.Y * units.Ey + offset.Yg
            };
        };

        var mapDPoint = function (p) {
            return {
                X: p.X * units.Ex,
                Y: p.Y * units.Ey
            };
        };

        var builder = pathBuilder();
        builder.M(mapPoint(path.startPoint));
        for (var k in path.path) {
            var p = path.path[k];
            builder.l(mapDPoint(p));
        }
        builder.Z();
        var sPath = builder.build();

        var element = svg.path(sPath);
        element.attr(options || {});
        return element;
    };

})(jQuery);