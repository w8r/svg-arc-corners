# SVG arc with rounded corners [![npm version](https://badge.fury.io/js/svg-arc-corners.svg)](https://badge.fury.io/js/svg-arc-corners)[![CircleCI](https://circleci.com/gh/w8r/svg-arc-corners.svg?style=svg)](https://circleci.com/gh/w8r/svg-arc-corners)

![Screenshot](https://cloud.githubusercontent.com/assets/26884/15583217/33b4a9f2-2375-11e6-8a53-eaeda12d3106.png)

A simple alternative to `d3.arc()`

### API

`cornerArc([cX, cY], radius, startAngle, endAngle, thickness, cornerRadius, <returnPoints>)`

```js
var cornerArc = require('svg-arc-corners');

var path = document.querySelector('#your-path');
path.setAttribute('d', cornerArc([0, 0], 150, 0, 45, 50, 10));
```

If you pass `true` for `returnPoints`, function will return the SVG path as an array of points and commands.

### Authors

* [Alexander Milevski @w8r](https://github.com/w8r)
* [Maksym Rusynyk @rumax](https://github.com/rumax)

### License

The MIT License (MIT)

Copyright (c) 2016 Alexander Milevski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
