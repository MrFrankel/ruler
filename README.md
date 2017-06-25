ruler.js
======

Demo page
### Demo
<a class="jsbin-embed" href="http://jsbin.com/nosumaroci/embed?html,css,js">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.41.5"></script>


ruler.js is an HTML5 ruler plugin that provides a set of 'photoshop' like rulers to surround the 'stage' of your authoring tools.
No jquery!
No dependencies!
###Installation
<hr>
<br/>

```terminal
npm install ruler.js --save
```

<br/>
Then
<br/>

```html
<script src="node_modules/ruler/css/ruler.css"></script>
<script src="node_modules/ruler/js/ruler.js"></script>
```

<br/>
##Getting Started
<hr>
<br/>

```javascript
var myRuler = new ruler({
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
myRuler.api.setPos({x:100, y:100})
/*
change the left, top, positions of the rulers
*/
myRuler.api.scale(1.5);
/*
change the scale of the points
*/
myRuler.api.toggleRulerVisibility(true);
/*
hide/show rulers
*/
myRuler.api.toggleGuideVisibility(true);
/*
hide/show guides
*/
myRuler.api.clearGuides(true);
/*
get list of guides to store or copy
*/
myRuler.api.getGuides(true);
/*
set guides from a pre stored list
*/
myRuler.api.setGuides(true);
/*
clear all guides
*/
myRuler.api.destory(true);
/*
remove rulers, guides and references;
*/
```


You can also clear a guide line by double clicking on it or dragging it back to the ruler



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


License
----

MIT


