

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
	theRulerDOM.style.display = state;
	var trackers = document.querySelector('.rul_tracker');
	if(trackers){
		trackers.style.display = state;
	}

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
