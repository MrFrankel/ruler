/**
 * Created by maor.frankel on 5/19/15.
 */
var cont = document.querySelector('#wrapper');
ruler.attachRulers({element: cont});

function setPosX(val){
    ruler.setPos({x:val});
}

function setPosY(val){
    ruler.setPos({y:val});
}

function setScale(val){
    ruler.setScale(val);
}