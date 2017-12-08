(function ($) {

    if (typeof $.esmool == 'undefined')
        $.esmool = {};

    $.esmool.svgkit = {};

    var parameter = {};

    var pathBuilder = () => {
        var path = [];
        var builder = {};

        builder.M = P => {
            path.push('M' + P.X + ',' + P.Y);
            return builder;
        };

        builder.l = P => {
            path.push('l' + P.X + ',' + P.Y);
            return builder;
        };

        builder.Z = P => {
            path.push('Z');
            return builder;
        };

        builder.build = () => path.join('');

        return builder;
    };

    $.esmool.svgkit.drawPiece = (svg, path, options, offset, units) => {
        var mapPoint = p => { return {
            X: p.X * units.Ex + offset.Xg,
            Y: p.Y * units.Ey + offset.Yg
        }; };

        var mapDPoint = p => { return {
            X: p.X * units.Ex,
            Y: p.Y * units.Ey
        }; };

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