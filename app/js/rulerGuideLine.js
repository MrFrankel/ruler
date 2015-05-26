/**
 * Created by maor.frankel on 5/23/15.
 */
ruler.guideLine = function(line, _dragContainer, options){

    var guideLine = line,
        dragContainer = _dragContainer;

    var draggable = (function(){
        return {
            move : function(xpos,ypos){
                guideLine.style.left = ruler.utils.pixelize(xpos);
                guideLine.style.top = ruler.utils.pixelize(ypos);
            },
            startMoving : function(evt){
                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    divTop = parseInt(guideLine.style.top || 0),
                    divLeft = parseInt(guideLine.style.left || 0),
                    eWi = parseInt(guideLine.offsetWidth),
                    eHe = parseInt(guideLine.offsetHeight),
                    cWi = parseInt(dragContainer.offsetWidth),
                    cHe = parseInt(dragContainer.offsetHeight);
                options.container.style.cursor='move';
                guideLine.style.cursor='move';
                var diffX = posX - divLeft,
                    diffY = posY - divTop;
                document.onmousemove =  function moving(evt){
                    evt = evt || window.event;
                    var posX = evt.clientX,
                        posY = evt.clientY,
                        aX = posX - diffX,
                        aY = posY - diffY;
                    if (aX < 0) aX = 0;
                    if (aY < 0) aY = 0;
                    if (aX + eWi > cWi) aX = cWi - eWi;
                    if (aY + eHe > cHe) aY = cHe -eHe;
                    draggable.move(aX,aY);
                }
            },
            stopMoving : function(){
                options.container.style.cursor=null;
                guideLine.style.cursor=null;
                document.onmousemove = function (){}
            }
        }
    })();

    var destroy = function(){
        guideLine.removeEventListener('mousedown');
        guideLine.removeEventListener('mouseup');
        guideLine.removeEventListener('dblclick');
        guideLine.parentNode.removeChild(guideLine);
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

    draggable.startMoving();


    return {
        setAsDraggable: draggable,
        startDrag: draggable.startMoving,
        stopDrag:  draggable.stopMoving,
        destroy: destroy,
        guideLine: guideLine
    };



};