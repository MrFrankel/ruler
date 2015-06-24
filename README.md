ruler.js
======

ruler.js is an HTML5 ruler plugin that provides a set of 'photoshop' like rulers to surround the 'stage' of your authoring tools.
No jquery!
No dependencies!
###Installation
<hr>
<br/>
```
bower install knockout-validation --save-dev
```
<br/>
#####Or directly
<br/>
```html
<script src="css/ruler.css"></script>
<script src="js/ruler.js"></script>
```
<br/>
##Getting Started
<hr>
<br/>
```javascript
 ruler.constructRulers({
        container: document.querySelector('#stage'),// reference to DOM element to apply rulers on
        rulerHeight: 15, // thickness of ruler
        fontFamily: 'arial',// font for points
        fontSize: '7px', 
        strokeStyle: 'black',
        lineWidth: 1,
        enableMouseTracking: true,
        enableToolTip: true
    });
```
### Usage 
```javascript
ruler.setPos({x:100, y:100})
/*
change the left, top, positions of the rulers
*/
ruler.scale(1.5);
/*
change the scale of the points
*/
ruler.toggleRulerVisibility(true);
/*
hide/show rulers
*/
ruler.toggleGuideVisibility(true);
/*
hide/show guides
*/
ruler.clearGuides(true);
/*
clear all guides
*/
```

You can also clear a guide line by double clicking on it or dragging it back to the ruler
### Demo
<a class="jsbin-embed" href="http://jsbin.com/qonababuyu/1/edit?output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

### Version
1.0.0

### Support

All latest browsers


### Development

Want to contribute? Great!

ruler.js uses grunt.
```sh
$ git clone https://github.com/MrFrankel/ruler.git
$ npm install
$ bower install
$ grunt build
```

### Todo's

Write Tests
Demo page

License
----

MIT


