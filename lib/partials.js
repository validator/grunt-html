'use strict';

module.exports = function( grunt, options, layoutData ) {
  var wrapTpl = grunt.file.read( layoutData.partialPath );
  var files = options.files;
  var content;
  var path;

  wrapTpl = wrapTpl.split( '<!-- CONTENT -->' );
  layoutData.cache = {};
  layoutData.files = [];
  layoutData.lineOffset = wrapTpl[ 0 ].split( /\n/ ).length - 1;

  for ( var i = 0, len = files.length; i < len; i++ ) {
    path = layoutData.tmpOutputDir + '/' + files[ i ].replace( /^(\.\.\/)+/, '' );
    content = wrapTpl[ 0 ] + grunt.file.read( files[ i ] ) + wrapTpl[ 1 ];
    grunt.file.write( path, content );
    layoutData.cache[ path ] = files[ i ];
    layoutData.files.push( path );
  }

  options.layoutData = layoutData;
  options.files = layoutData.files;
};
