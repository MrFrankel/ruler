var ruler = (function (){
	var options = {},
		canvasVer,
		canvasHor,
		container,
		corner;



	var attachRulers = function(curOptions){
		var defaultOptions = {
			vRulerHeight: 15,
			hRulerWidth: 15,
			fontFamily: 'arial',
			fontSize: '10px',
			strokeStyle: 'black',
			lineWidth: 1
		};
		var theRulerDOM = '<div class="rul_wrapper">' +
			'<canvas class="rul_ruler rul_ruler_Horizontal" ></canvas>'+
			'<canvas class="rul_ruler rul_ruler_Vertical" ></canvas>' +
			'<div class="rul_ruler rul_corner"></div>' +
			'</div>';

		container = curOptions.element;
		options = Utils.extend(defaultOptions, curOptions);
		container.insertAdjacentHTML( 'beforeend', theRulerDOM );
		corner = setCorner(options.hRulerWidth, options.vRulerHeight, container.querySelector('.rul_corner'));
		canvasVer = setRuler(container.querySelector('.rul_ruler_Horizontal'), options.element.offsetWidth, options.vRulerHeight, 0);
		canvasHor = setRuler(container.querySelector('.rul_ruler_Vertical'), options.element.offsetWidth, options.vRulerHeight, 90);
		canvasVer.addEventListener('click', function (e){
			var line = document.createElement('div');
			line.style.left = (e.pageX - container.offsetLeft) + 'px';
			line.className = 'rul_line rul_lineVer';
			line = container.querySelector('.rul_wrapper').appendChild(line);
			line.addEventListener('mousedown', function (e){
				setAsDraggable.startMoving(line, '.rul_wrapper', e);
				e.stopPropagation();
			});
			line.addEventListener('mouseup', function (e){
				setAsDraggable.stopMoving('.rul_wrapper');
			});
			line.addEventListener('dblclick', function (e){
				container.querySelector('.rul_wrapper').removeChild(line);
			});

		});
		canvasHor.addEventListener('click', function (e){
			var line = document.createElement('div');
			line.style.top = (e.pageY - container.offsetTop) + 'px';
			line.className = 'rul_line rul_lineHor';
			line = container.querySelector('.rul_wrapper').appendChild(line);
			line.addEventListener('mousedown', function (e){
				setAsDraggable.startMoving(line, '.rul_wrapper', e);
				e.stopPropagation();
			});
			line.addEventListener('mouseup', function (e){
				setAsDraggable.stopMoving('.rul_wrapper');
			});
			line.addEventListener('dblclick', function (e){
				container.querySelector('.rul_wrapper').removeChild(line);
			});

		});

	};

	var setScale = function(val){

		var context = canvasHor.getContext('2d');
		context.clearRect(0, 0, canvasHor.width, canvasHor.height);
		context.beginPath();
		drawRuler( canvasHor.width, canvasHor.height, context, val);
		context.stroke();
		context.beginPath();
		context = canvasVer.getContext('2d');
		context.clearRect(0, 0, canvasVer.width, canvasVer.height);
		drawRuler( canvasVer.width, canvasVer.height, context, val);
		context.stroke();
	};

	var setPos = function(val){
		var prevLeft, prevTop;
		prevLeft =  canvasVer.style.left;
		prevTop = canvasHor.style.top;
		if(val.x){
			canvasVer.style.left = -(parseInt(options.element.offsetWidth*2) + parseInt(val.x)) + 'px';
			[].forEach.call(container.querySelectorAll('.rul_lineVer'), function (line){
				line.style.left = parseInt(line.style.left) - (parseInt(prevLeft) - parseInt(canvasVer.style.left ))  + 'px';
			});
		}
		if(val.y){
			canvasHor.style.top = -parseInt(val.y || 0) + 'px';
			[].forEach.call(container.querySelectorAll('.rul_lineHor'), function (line){
				line.style.top = parseInt(line.style.top) - (parseInt(prevTop) - parseInt(canvasHor.style.top ))  + 'px';
			});
		}

	};


	/////////Private///////
	var setRuler = function (ruler, width, height, angle){
		var context = ruler.getContext("2d");
		ruler.style.left = -(width*2) + 'px';
		ruler.width = width * 4;
		ruler.height = height;
		context.strokeStyle = options.strokeStyle;
		context.font = options.fontSize + ' ' + options.fontFamily;
		context.lineWidth = options.lineWidth;
		context.beginPath();
		drawRuler( ruler.width, ruler.height, context);
		if(angle){
			ruler.style.left = parseInt(ruler.style.left) + ruler.height/2 +'px';
			ruler.style.top = parseInt(ruler.style.top || 0) - ruler.height/2 +'px';
			ruler.style.webkitTransform =  'rotate(' + angle + 'deg)';
			ruler.style.MozTransform =  'rotate(' + angle + 'deg)';
			ruler.style.OTransform =  'rotate(' + angle + 'deg)';
			ruler.style.msTransform =  'rotate(' + angle + 'deg)';
			ruler.style.transform =  'rotate(' + angle + 'deg)';

			/*ruler.style.webkitTransformOrigin = '50% ' + ruler.height + 'px';
			 ruler.style.MozTransformOrigin = '50% ' + ruler.height + 'px';
			 ruler.style.OTransformOrigin = '50% ' + ruler.height + 'px';
			 ruler.style.msTransformOrigin = '50% ' + ruler.height + 'px';
			 ruler.style.transformOrigin = '50% ' + ruler.height + 'px';*/

		}
		context.stroke();
		return ruler;
	};

	var setCorner = function(height, width,  cornerElem){
		cornerElem.style.height = height + 'px';
		cornerElem.style.width = width + 'px';
		cornerElem.style.width = width + 'px';
		return cornerElem;
	};

	var Utils = {
		extend: function extend(){
			for(var i=1; i< arguments.length; i++)
				for(var key in arguments[i])
					if(arguments[i].hasOwnProperty(key))
						arguments[0][key] = arguments[i][key];
			return arguments[0];
		}
	} ;

	var drawRuler = function (rulerLength, rulerThickness, context, scale) {
		scale = scale || 1;
		var pointLength = 0,
			label = '',
			delta = 0,
			draw = false,
			lineLengthMax = 0,
			lineLengthMed = rulerThickness / 2,
			lineLengthMin = rulerThickness / 1.3;

		for (var pos = 0; pos <= rulerLength; pos += 1) {
			delta = ((rulerLength / 2) - pos);
			draw = false;
			label = '';

			if (delta % 50 === 0) {
				pointLength = lineLengthMax;
				label = Math.round(Math.abs(delta)/scale);
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
				context.moveTo(pos + 0.5, rulerThickness + 0.5);
				context.lineTo(pos+ 0.5, pointLength+ 0.5);
				context.fillText(label, pos + 1.5, rulerThickness / 1.5);
			}

		}
	};



	var setAsDraggable = (function(){
		return {
			move : function(divid,xpos,ypos){
				divid.style.left = xpos + 'px';
				divid.style.top = ypos + 'px';
			},
			startMoving : function(divid,container,evt){
				evt = evt || window.event;
				var posX = evt.clientX,
					posY = evt.clientY,
					divTop = divid.style.top,
					divLeft = divid.style.left,
					eWi = parseInt(divid.offsetWidth),
					eHe = parseInt(divid.offsetHeight),
					cWi = parseInt(document.querySelector(container).offsetWidth),
					cHe = parseInt(document.querySelector(container).offsetHeight);
				document.querySelector(container).style.cursor='move';
				divTop = divTop.replace('px','');
				divLeft = divLeft.replace('px','');
				var diffX = posX - divLeft,
					diffY = posY - divTop;
				document.onmousemove = function(evt){
					evt = evt || window.event;
					var posX = evt.clientX,
						posY = evt.clientY,
						aX = posX - diffX,
						aY = posY - diffY;
					if (aX < 0) aX = 0;
					if (aY < 0) aY = 0;
					if (aX + eWi > cWi) aX = cWi - eWi;
					if (aY + eHe > cHe) aY = cHe -eHe;
					setAsDraggable.move(divid,aX,aY);
				}
			},
			stopMoving : function(container){
				var a = document.createElement('script');
				document.querySelector(container).style.cursor='default';
				document.onmousemove = function(){}
			}
		}
	})();



	return {
		attachRulers: attachRulers,
		setPos: setPos,
		setScale: setScale
	}
})();


