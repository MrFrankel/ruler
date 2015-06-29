"use strict";
var ruler = (function (){
	var VERTICAL = 1,
		HORIZONTAL = 2,
		CUR_DELTA_X = 0,
		CUR_DELTA_Y = 0;

	var options,
		rulerz = {},
		guides = [],
		theRulerDOM = document.createElement('div'),
		defaultOptions = {
			rulerHeight: 15,
			fontFamily: 'arial',
			fontSize: '8px',
			strokeStyle: 'gray',
			sides: ['top', 'left'],
			cornerSides: ['TL'],
			lineWidth: 1,
			enableMouseTracking: true,
			enableToolTip: true
		};

	var rotateRuler = function(curRuler, angle){
		var rotation = 'rotate(' + angle + 'deg)';
		var origin = ruler.utils.pixelize(Math.abs(parseInt(curRuler.canvas.style.left))) + ' 100%';
		curRuler.canvas.style.webkitTransform = rotation;
		curRuler.canvas.style.MozTransform = rotation;
		curRuler.canvas.style.OTransform = rotation;
		curRuler.canvas.style.msTransform = rotation;
		curRuler.canvas.style.transform = rotation;
		curRuler.canvas.style.webkitTransformOrigin = origin;
		curRuler.canvas.style.MozTransformOrigin = origin;
		curRuler.canvas.style.OTransformOrigin = origin;
		curRuler.canvas.style.msTransformOrigin = origin;
		curRuler.canvas.style.transformOrigin = origin;

	};

	var positionRuler = function(curRuler, alignment){
		curRuler.canvas.style.left = ruler.utils.pixelize(-((curRuler.canvas.width/2) - curRuler.canvas.height));
		switch (alignment){
			case 'top':
				curRuler.orgPos = parseInt(curRuler.canvas.style.left);
				break;
			case 'left':
				curRuler.canvas.style.top = ruler.utils.pixelize(-curRuler.canvas.height - 1);
				curRuler.orgPos = parseInt(curRuler.canvas.style.top);
				rotateRuler(curRuler, 90);
				break;
		}
	};

	var attachListners = function(container, curRul){
		var guideIndex;
		var moveCB = function (line, x, y){
			var coor = line.dimension === VERTICAL ? x : y;
			if(!line.assigned()){
				if(coor > options.rulerHeight){
					line.assigned(true);
				}
				return;
			}

			if(coor < options.rulerHeight){
				guides.some(function(guideLine, index){
					if(guideLine.line === line){
						guideIndex = index;
						return true;
					}
				});
				line.destroy();
				guides.splice(guideIndex, 1);

			}


		};

		curRul.canvas.addEventListener('mousedown', function (e){
			var guide = document.createElement('div'),
				guideStyle = curRul.dimension === VERTICAL ? 'rul_lineVer' : 'rul_lineHor',
				curDelta = curRul.dimension === VERTICAL ? CUR_DELTA_X : CUR_DELTA_Y;
			guide.title = 'Double click to delete';
			ruler.utils.addClasss(guide, ['rul_line', guideStyle]);
			guide = container.appendChild(guide);
			if(curRul.dimension === VERTICAL){
				guide.style.left = ruler.utils.pixelize(e.clientX - options.container.offsetLeft);
			}
			else{
				guide.style.top = ruler.utils.pixelize(e.clientY - options.container.offsetTop);
			}
			guides.push({dimension: curRul.dimension, line:ruler.guideLine(guide, options.container.querySelector('.rul_wrapper') ,curRul.dimension,  options, curDelta, moveCB, e)});


		});

	};

	var constructRuler = function(container, alignment){
		var canvas,
			dimension = alignment === 'left' || alignment === 'right' ? VERTICAL : HORIZONTAL,
			rulerStyle = dimension === VERTICAL ? 'rul_ruler_Vertical' : 'rul_ruler_Horizontal',
			element = document.createElement('canvas');


		ruler.utils.addClasss(element, ['rul_ruler', rulerStyle, 'rul_align_' + alignment]);
		canvas = container.appendChild(element);
		rulerz[alignment] = ruler.rulerConstructor(canvas, options, dimension);
		rulerz[alignment].drawRuler(container.offsetWidth, options.rulerHeight);
		positionRuler(rulerz[alignment], alignment);
		attachListners(container, rulerz[alignment]);
	};

	var constructCorner = (function(){
		function cornerDraw(container, side){
			var corner = document.createElement('div'),
				cornerStyle = 'rul_corner' + side.toUpperCase();

			corner.title = 'Clear Guide lines';
			ruler.utils.addClasss(corner, ['rul_corner', cornerStyle]);
			corner.style.width = ruler.utils.pixelize(options.rulerHeight + 1);
			corner.style.height = ruler.utils.pixelize(options.rulerHeight);
			return container.appendChild(corner);

		}

		return function (container, cornerSides) {
			cornerSides.forEach(function (side){
				cornerDraw(container, side).addEventListener('mousedown', function (e){
					e.stopPropagation();
					clearGuides();
				})
			})
		}

	})();

	var constructRulers = function(curOptions){
		theRulerDOM = ruler.utils.addClasss(theRulerDOM, 'rul_wrapper');
		options = ruler.utils.extend(defaultOptions, curOptions);
		theRulerDOM = options.container.appendChild(theRulerDOM);
		options.sides.forEach(function(side){
			constructRuler(theRulerDOM, side);
		});
		constructCorner(theRulerDOM, options.cornerSides);
		options.container.addEventListener('mouseup', function (e){
			guides.forEach(function (guide){
				guide.line.stopDrag();
			})
		})


	};

	var forEachRuler = function (cb){
		var index = 0;
		for(var rul in rulerz) {
			if (rulerz.hasOwnProperty(rul)) {
				cb(rulerz[rul], index++);
			}
		}
	};


	var setPos = function (values){
		var orgX = 0,
			orgY,
			deltaX = 0,
			deltaY = 0;
		forEachRuler(function (curRul){
			if(curRul.dimension === ruler.VERTICAL){
				orgY = curRul.canvas.style.top;
				curRul.canvas.style.top = ruler.utils.pixelize(curRul.orgPos + (parseInt(values.y)));
				deltaY = parseInt(orgY) - parseInt(curRul.canvas.style.top);
			}
			else{
				orgX = curRul.canvas.style.left;
				curRul.canvas.style.left = ruler.utils.pixelize(curRul.orgPos + (parseInt(values.x)));
				deltaX = parseInt(orgX) - parseInt(curRul.canvas.style.left);
			}
		});
		guides.forEach(function(guide){
			if(guide.dimension === HORIZONTAL){
				guide.line.guideLine.style.top = ruler.utils.pixelize(parseInt(guide.line.guideLine.style.top) - deltaY);
				guide.line.curPosDelta(parseInt(values.y));
			}
			else{
				guide.line.guideLine.style.left = ruler.utils.pixelize(parseInt(guide.line.guideLine.style.left) - deltaX);
				guide.line.curPosDelta(parseInt(values.x));
			}
		});
		CUR_DELTA_X = parseInt(values.x);
		CUR_DELTA_Y = parseInt(values.y);

	};

	var setScale = function (newScale){
		var curPos, orgDelta, curScaleFac;
		forEachRuler(function (rul){
			rul.context.clearRect(0, 0, rul.canvas.width, rul.canvas.height);
			rul.context.beginPath();
			rul.setScale(newScale);
			rul.context.stroke();
		});

		guides.forEach(function (guide){
			if(guide.dimension === HORIZONTAL){
				curPos = parseInt(guide.line.guideLine.style.top);
				orgDelta = options.rulerHeight + 1;
				curScaleFac = (parseFloat(newScale) / guide.line.curScale());
				guide.line.guideLine.style.top = ruler.utils.pixelize(((curPos - orgDelta - CUR_DELTA_Y ) / curScaleFac) +  orgDelta + CUR_DELTA_Y);
				guide.line.curScale(newScale);
			}
			else {
				curPos = parseInt(guide.line.guideLine.style.left);
				orgDelta = options.rulerHeight + 1;
				curScaleFac = (parseFloat(newScale) / guide.line.curScale());
				guide.line.guideLine.style.left = ruler.utils.pixelize(((curPos - orgDelta - CUR_DELTA_X) / curScaleFac)  + orgDelta + CUR_DELTA_X);
				guide.line.curScale(newScale);
			}
		});
	};


	var clearGuides = function (){
		guides.forEach(function (guide){
			guide.line.destroy();
		});
		guides = [];
	};

	var toggleGuideVisibility = function (val){
		var func = val ? 'show' : 'hide';
		guides.forEach(function (guide){
			guide.line[func]();
		});
	};

	var toggleRulerVisibility = function (val){
		var state = val ? 'block' : 'none';
		options.container.style.display = state;
	};


	return{
		VERTICAL: VERTICAL,
		HORIZONTAL: HORIZONTAL,
		setPos: setPos,
		setScale: setScale,
		clearGuides: clearGuides,
		constructRulers: constructRulers,
		toggleRulerVisibility: toggleRulerVisibility,
		toggleGuideVisibility: toggleGuideVisibility

	}
})();



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
		orgPos = 0,
		tracker = document.createElement('div');

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
				context.fillText(label, pos + 1.5, (rulThickness / 2) + 1);
			}
		}
	};

	var initTracker = function(){
		tracker = options.container.appendChild(tracker);
		ruler.utils.addClasss(tracker, 'rul_tracker');
		var height = ruler.utils.pixelize(options.rulerHeight);
		if(dimension === ruler.HORIZONTAL){
			tracker.style.height = height;
		}
		else{
			tracker.style.width = height;
		}

		options.container.addEventListener('mousemove', function(e){
			var posX = e.clientX;
			var posY = e.clientY;
			if(dimension === ruler.HORIZONTAL){
				tracker.style.left = ruler.utils.pixelize(posX - parseInt(options.container.offsetLeft));
			}
			else{
				tracker.style.top = ruler.utils.pixelize(posY - parseInt(options.container.offsetTop)) ;
			}
		});
	};
	if(options.enableMouseTracking){
		initTracker();
	}


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



/**
 * Created by maor.frankel on 5/23/15.
 */
ruler.guideLine = function(line, _dragContainer, lineDimension, options,  curDelta, moveCB, event){

	var self,
		guideLine = line,
		_curScale = 1,
		_assigned = false,
		_curPosDelta = curDelta || 0,
		dragContainer = _dragContainer,
		dimension = lineDimension || ruler.HORIZONTAL,
		moveCB = moveCB || function(){};


	var curPosDelta = function(val){
		if(typeof val === 'undefined'){
			return _curPosDelta;
		}
		return (_curPosDelta = val);
	};

	var assigned = function(val){
		if(typeof val === 'undefined'){
			return _assigned;
		}
		return (_assigned = val);
	};

	var curScale = function(val){
		if(typeof val === 'undefined'){
			return _curScale;
		}
		return (_curScale = val);
	};



	var draggable = (function(){
		return {
			move : function(xpos,ypos){
				guideLine.style.left = ruler.utils.pixelize(xpos);
				guideLine.style.top = ruler.utils.pixelize(ypos);
				updateToolTip(xpos, ypos);
				moveCB(self, xpos, ypos);
			},
			startMoving : function(evt){
				ruler.utils.addClasss(guideLine, ['rul_line_dragged']);
				evt = evt || window.event;
				var posX = evt ? evt.clientX : 0,
					posY = evt ? evt.clientY : 0,
					divTop = parseInt(guideLine.style.top || 0),
					divLeft = parseInt(guideLine.style.left || 0),
					eWi = parseInt(guideLine.offsetWidth),
					eHe = parseInt(guideLine.offsetHeight),
					cWi = parseInt(dragContainer.offsetWidth),
					cHe = parseInt(dragContainer.offsetHeight),
					cursor = dimension === ruler.HORIZONTAL ? 'ns-resize' : 'ew-resize';

				options.container.style.cursor=cursor;
				guideLine.style.cursor=cursor;
				var diffX = posX - divLeft,
					diffY = posY - divTop;
				document.onmousemove =  function moving(evt){
					evt = evt || window.event;
					var posX = evt.clientX,
						posY = evt.clientY,
						aX = posX - diffX,
						aY = posY - diffY;
					if (aX < 0) {
						aX = 0;
					}
					if (aY < 0) {
						aY = 0;
					}

					if (aX + eWi > cWi) {
						aX = cWi - eWi;
					}
					if (aY + eHe > cHe) {
						aY = cHe -eHe;
					}

					draggable.move(aX,aY);
				};
				showToolTip();
			},
			stopMoving : function(){
				options.container.style.cursor=null;
				guideLine.style.cursor=null;
				document.onmousemove = function (){};
				hideToolTip();
				ruler.utils.removeClasss(guideLine, ['rul_line_dragged']);
			}
		}
	})();

	var showToolTip =  function (e){
		if(!options.enableToolTip){
			return;
		}
		ruler.utils.addClasss(guideLine, 'rul_tooltip');
	};

	var updateToolTip = function (x, y){
		if(y){
			guideLine.dataset.tip = 'Y: ' + Math.round((y - options.rulerHeight - 1 - _curPosDelta)*_curScale) + ' px';
		}
		else{
			guideLine.dataset.tip = 'X: '  + Math.round((x - options.rulerHeight - 1 - _curPosDelta)*_curScale) + ' px';
		}
	};

	var hideToolTip = function (e){
		ruler.utils.removeClasss(guideLine, 'rul_tooltip');
	};

	var destroy = function(){
		draggable.stopMoving();
		guideLine.parentNode.removeChild(guideLine);
	};

	var hide = function(){
		guideLine.style.display = 'none';
	};

	var show = function(){
		guideLine.style.display = 'block';
	};


	guideLine.addEventListener('mousedown', function (e){
		e.stopPropagation();
		draggable.startMoving();
	});

	guideLine.addEventListener('mouseup', function (e){
		draggable.stopMoving();
	});

	guideLine.addEventListener('dblclick', function (e){
		e.stopPropagation();
		destroy();
	});

	draggable.startMoving(event);

	self = {
		setAsDraggable: draggable,
		startDrag: draggable.startMoving,
		stopDrag:  draggable.stopMoving,
		destroy: destroy,
		curScale: curScale,
		assigned: assigned,
		curPosDelta: curPosDelta,
		guideLine: guideLine,
		dimension: dimension,
		hide: hide,
		show: show
	};
	return self;



};
/**
 * Created by maor.frankel on 5/25/15.
 */
ruler.utils = {
	extend: function extend(){
		for(var i=1; i< arguments.length; i++)
			for(var key in arguments[i])
				if(arguments[i].hasOwnProperty(key))
					arguments[0][key] = arguments[i][key];
		return arguments[0];
	},
	pixelize: function (val){
		return val + 'px';
	},
	prependChild: function (container, element){
		return container.insertBefore(element,container.firstChild);
	},
	addClasss: function (element, classNames){
		if(!(classNames instanceof Array))
		{
			classNames = [classNames];
		}

		classNames.forEach(function (name){
			element.className += ' ' + name;
		});

		return element;

	},
	removeClasss: function (element, classNames){
		var curCalsss = element.className;
		if(!(classNames instanceof Array))
		{
			classNames = [classNames];
		}

		classNames.forEach(function (name){
			curCalsss = curCalsss.replace(name, '');
		});
		element.className = curCalsss;
		return element;

	}
} ;
