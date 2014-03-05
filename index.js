'use strict';
var es = require('event-stream');
var im = require('imagemagick-native');
var gutil = require('gulp-util');

module.exports = function(options) {
  return es.map(function(file, cb) {
    var info = im.identify({srcData:file.contents});
    var widthShift = 0;
    var heightShift = 0;
    if ( (info.width%2) === 1 ) {
      widthShift = 1;
    }
    if ( (info.height%2) === 1 ) {
      heightShift = 1;
    }
    var resizeOptions ={
      resizeStyle: 'aspectfit',
      srcData: file.contents,
      width: (info.width+widthShift)/2,
      height: (info.height+heightShift)/2
    };
    file.contents = im.convert(resizeOptions);
    cb(null, file);
  });
};
