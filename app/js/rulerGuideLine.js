/**
 * Created by maor.frankel on 5/23/15.
 */
ruler.guideLine = function(line, _dragContainer, lineDimension, options,  curDelta, moveCB, event){

    var self,
        guideLine = line,
        curScale = 1,
        curPosDelta = curDelta || 0,
        dragContainer = _dragContainer,
        dimension = lineDimension || ruler.HORIZONTAL,
        moveCB = moveCB || function(){}, assigned = false;


    var draggable = (function(){
        return {
            move : function(xpos,ypos){
                guideLine.style.left = ruler.utils.pixelize(xpos);
                guideLine.style.top = ruler.utils.pixelize(ypos);
                updateToolTip(xpos, ypos);
                moveCB(self, xpos, ypos);
            },
            startMoving : function(evt){
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
            guideLine.dataset.tip = 'Y: ' + (y - options.rulerHeight - 1 - curPosDelta);
        }
        else{
            guideLine.dataset.tip = 'X: ' + (x - options.rulerHeight - 1 - curPosDelta);
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
        curPosDelta: curPosDelta,
        guideLine: guideLine,
        dimension: dimension,
        hide: hide,
        show: show
    };
    return self;



};