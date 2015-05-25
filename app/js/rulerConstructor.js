/**
 * Created by maor.frankel on 5/23/15.
 */
ruler.rulerConstructor =  function(_canvas, options, rulDimension)
{

    var canvas = _canvas,
        context = canvas.getContext('2d'),
        rulThickness = 0,
        rulLength = 0,
        rulScale = 1,
        dimension = rulDimension || ruler.HORIZONTAL,
        orgPos = 0;

    var getLength = function (){
        return rulLength;
    };

    var getThickness = function(){
        return rulThickness;
    };

    var getScale = function(){
        return rulScale;
    };

    var setScale = function(newScale){
        rulScale = parseFloat(newScale);
        drawPoints();
        return rulScale;
    };

    var drawRuler = function (_rulerLength, _rulerThickness, _rulerScale){
        rulLength = canvas.width = _rulerLength * 4;
        rulThickness = canvas.height = _rulerThickness;
        rulScale = _rulerScale || rulScale;
        context.strokeStyle = options.strokeStyle;
        context.font = options.fontSize + ' ' + options.fontFamily;
        context.lineWidth = options.lineWidth;
        context.beginPath();
        drawPoints();
        context.stroke();
    };

    var drawPoints = function () {
        var  pointLength = 0,
            label = '',
            delta = 0,
            draw = false,
            lineLengthMax = 0,
            lineLengthMed = rulThickness / 2,
            lineLengthMin = rulThickness / 2;



        for (var pos = 0; pos <= rulLength; pos += 1) {
            delta = ((rulLength / 2) - pos);
            draw = false;
            label = '';

            if (delta % 50 === 0) {
                pointLength = lineLengthMax;
                label = Math.round(Math.abs(delta)*rulScale);
                draw = true;
            }
            else if (delta % 25 === 0) {
                pointLength = lineLengthMed;
                draw = true;
            }
            else if (delta % 5 === 0) {
                pointLength = lineLengthMin;
                draw = true;
            }
            if (draw) {
                context.moveTo(pos + 0.5, rulThickness + 0.5);
                context.lineTo(pos + 0.5, pointLength +  0.5);
                context.fillText(label, pos + 1.5, rulThickness / 2);
            }

        }
    };

    return{
        getLength: getLength,
        getThickness: getThickness,
        getScale: getScale,
        setScale: setScale,
        dimension: dimension,
        orgPos: orgPos,
        canvas: canvas,
        context: context,
        drawRuler: drawRuler,
        drawPoints: drawPoints
    }
};


