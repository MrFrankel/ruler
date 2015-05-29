ruler.js
======

ruler.js is an HTML5 ruler plugin that provides a set of 'photoshop' like rulers to surround the 'stage' of your authoring tools.

###Installation
<hr>
<br/>
```
bower install knockout-validation --save-dev
```
#####Or directly
<br/>
```html
<script src="css/ruler.css"></script>
<script src="js/ruler.js"></script>
```
<br/>
#Getting Started
<hr>
<br/>
```javascript
 ruler.constructRulers({
        container: document.querySelector('#stage'),// reffrence to DOM element to apply rulers on 
        rulerHeight: 15, // thickness of ruler
        fontFamily: 'arial',// font for points
        fontSize: '7px', 
        strokeStyle: 'black',
        lineWidth: 1
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
```
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
$ grune build
```

### Todo's

Write Tests
Demo page

License
----

MIT


