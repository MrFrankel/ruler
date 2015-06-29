
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