/**
 * Created by maor.frankel on 5/19/15.
 */
ruler.constructRulers({container: document.querySelector('#wrapper')});
var guides;
function setPosX(val){
    ruler.setPos({x:val});
}

function setPosY(val){
    ruler.setPos({y:val});
}

function setScale(val){
    ruler.setScale(val);
}

function clearGuides(){
  ruler.clearGuides();
}

function storeGuides(){
  guides = ruler.getGuides();
}

function setGuides(){
  ruler.setGuides(guides);
}

function destory(){
  ruler.destroy();
}