/**
 * Created by maor.frankel on 5/19/15.
 */
var rul1 = new ruler({container: document.querySelector('#wrapper')});
var guides1;
var visible1 = true;
var visibleGuides1 = true;

var rul2 = new ruler({container: document.querySelector('#wrapper2')});
var guides2;
var visible2 = true;
var visibleGuides2 = true;

function setPosX1(val){
  rul1.api.setPos({x:val});
}

function setPosY1(val){
  rul1.api.setPos({y:val});
}

function setScale1(val){
  rul1.api.setScale(val);
}

function hideRuler1(){
  rul1.api.toggleRulerVisibility(visibleGuides1 = !visibleGuides1);
}

function clearGuides1(){
  rul1.api.clearGuides();
}

function storeGuides1(){
  guides1 = rul1.api.getGuides();
}

function setGuides1(){
  rul1.api.setGuides(guides1);
}

function hideGuides1(){
  rul1.api.toggleGuideVisibility(visible1 = !visible1);
}

function destory1(){
  rul1.api.destroy();
}


function setPosX2(val){
  rul2.api.setPos({x:val});
}

function setPosY2(val){
  rul2.api.setPos({y:val});
}

function setScale2(val){
  rul2.api.setScale(val);
}

function hideRuler2(){
  rul2.api.toggleRulerVisibility(visibleGuides2 = !visibleGuides2);
}

function clearGuides2(){
  rul2.api.clearGuides();
}

function storeGuides2(){
  guides2 = rul2.api.getGuides();
}

function setGuides2(){
  rul2.api.setGuides(guides2);
}

function hideGuides2(){
  rul2.api.toggleGuideVisibility(visible2 = !visible2);
}

function destory2(){
  rul2.api.destroy();
}