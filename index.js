'use strict';
var es = require('event-stream');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var gutil = require('gulp-util');

module.exports = function(options) {
  return es.map(function(file, cb) {
    mkdirp(path.normalize(options.tmpPath + '/evening'));
    mkdirp(path.normalize(options.tmpPath + '/reducing'));
    im.identify(file.path, function(err, image){
      if (err) throw err;
      var widthShift = 0;
      var heightShift = 0;
      if ( (image.width%2) === 1 ) {
        widthShift = 1;
      }
      if ( (image.height%2) === 1 ) {
        heightShift = 1;
      }
      var cropOptions ={
        srcPath: file.path,
        dstPath: path.normalize(options.tmpPath + '/evening/' + path.basename(file.path)),
        width: image.width+widthShift,
        height: image.height+heightShift,
        pad: true
      }
      im.crop(cropOptions, function(err){
        var resizeOptions ={
          srcPath: path.normalize(options.tmpPath + '/evening/' + path.basename(file.path)),
          dstPath: path.normalize(options.tmpPath + '/reducing/' + path.basename(file.path)),
          width: (image.width+widthShift)/2,
          height: (image.height+heightShift)/2,
          filter: 'Lagrange',
          sharpening: 0.2
        };
        im.resize(resizeOptions, function(err){
          fs.readFile(path.normalize(options.tmpPath + '/reducing/' + path.basename(file.path)), function(err, data){
            file.contents = data;
            cb(null, file);
          });
        });
      });
    });
  });
};
