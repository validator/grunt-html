'use strict';

module.exports = function( config, done ) {
  var path = require( 'path' );
  var exec = require( 'child_process' ).exec;
  var chunkify = require( './chunkify' );
  var async = require( 'async' );
  var javadetect = require( './javadetect' );
  var jar = require( 'vnu-jar' );

  var maxChars = 5000;

  // increase child process buffer to accommodate large amounts of
  // validation output. ( default is a paltry 200k. )
  // http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
  var maxBuffer = 20000 * 1024;

  // replace left/right quotation marks with normal quotation marks
  function normalizeQuotationMarks( str ) {
    if ( str ) {
      str = str.replace( /[\u201c\u201d]/g, '"' );
    }
    return str;
  }

  // parse and, if needed, normalize error messages from HttpClient to java -jar format
  // java -jar: one object containing messages for all files
  //   { messages: [{ message, type, url, ... }, ...] }
  // HttpClient: one object per file, separated by a newline, each object containing messages for only that file
  //   { messages: [{ message, type, ...}, ...], url }\n{ ... }
  function parseErrorMessages( errors ) {
    var parsed = JSON.parse( config.server ? '[' + errors.trim().replace( /\n/g, ',' ) + ']' : errors );
    var messages = parsed.messages;
    if ( config.server ) {
      // extract "messages" property from each object and set the url of each message
      // this results in an array of arrays instead of array of objects, which is then flattened by concatenation
      messages = Array.prototype.concat.apply([], parsed.map(function( file ) {
        return file.messages.map(function( message ) {
          message.url = file.url;
          return message;
        });
      }) );
    }
    return messages;
  }

  // determine proper jarfile command and arguments
  function cmd( java, chunk ) {
    var args = '';
    if ( config.server ) {
      if ( config.server.host ) {
        args += ' -Dnu.validator.client.host=' + config.server.host;
      }
      if ( config.server.port ) {
        args += ' -Dnu.validator.client.port=' + config.server.port;
      }
      args += ' -Dnu.validator.client.out=json nu.validator.client.HttpClient';
    } else {
      args += ' --format json';
    }
    var invoke = ( config.server ? '-cp' : '-jar' ) + ' "' + jar + '"' + args;
    // command to call java, increasing the default stack size for ia32 versions of the JRE and using the default setting for x64 versions
    return 'java ' + ( java.arch === 'ia32' ? '-Xss512k ' : '' ) + invoke + ' ' + chunk;
  }

  if ( !config.files.length ) {
    return done( null, []);
  }

  javadetect(function( err, java ) {
    if ( err ) {
      throw err;
    }

    if ( java.version[ 0 ] !== '1' || ( java.version[ 0 ] === '1' && java.version[ 2 ] < '8' ) ) {
      throw new Error( '\nUnsupported Java version used: ' + java.version + '. v1.8 is required!' );
    }

    var files = config.files.map( path.normalize );
    async.mapSeries( chunkify( files, maxChars ), function( chunk, cb ) {

      exec( cmd( java, chunk ), {
        'maxBuffer': maxBuffer
      }, function( error, stdout, stderr ) {
        if ( error && ( error.code !== 1 || error.killed || error.signal ) ) {
          cb( error );
          return;
        }

        stderr = config.server ? stdout : stderr;
        var result = [];
        if ( stderr ) {
          try {
            result = parseErrorMessages( stderr );
          } catch ( err ) {
            throw new Error( err + '\nInvalid input follows below:\n\n' + stderr );
          }
          result.forEach(function( message ) {
            if ( message.url ) {
              message.file = path.relative( '.', message.url.replace( path.sep !== '\\' ? 'file:' : 'file:/', '' ) );
            }
            if ( config.absoluteFilePathsForReporter ) {
              message.file = path.resolve( message.file );
            }
          });
          if ( config.ignore ) {
            var ignore = config.ignore instanceof Array ? config.ignore : [ config.ignore ];
            result = result.filter(function( message ) {
              // iterate over the ignore rules and test the message agains each rule.
              // A match should return false, which causes every(  ) to return false and the message to be filtered out.
              return ignore.every(function( currentValue ) {
                if ( currentValue instanceof RegExp ) {
                  return !currentValue.test( message.message );
                }
                return normalizeQuotationMarks( currentValue ) !== normalizeQuotationMarks( message.message );
              });
            });
          }
        }
        cb( null, result );
      });
    }, function( error, results ) {
      if ( error ) {
        done( error );
        return;
      }

      var result = [];
      for ( var r = 0, len = results.length; r < len; r++ ) {
        result = result.concat( results[ r ] );
      }
      done( null, result.filter(function( item ) {
        return config.errorlevels.indexOf( item.type ) !== -1;
      }) );
    });
  });
};
