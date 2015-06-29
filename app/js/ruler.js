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


