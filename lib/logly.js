//var fs = require( 'fs' );

//exports.version =
//  JSON.parse( fs.readFileSync( __dirname + '/package.json' ) ).version;

var name = {};
var mode = {};
var colourText = false; //true if the output should be coloured
var colours = {}; //set up below colour functions


// because logly is a singleton, we save global settings as a hash
//  using process.pid as keys
name[ process.pid ] = 'logly';
mode[ process.pid ] = 'standard';

var logger = function( input, methodMode ) {
  if ( typeof( input ) === "string" ) {
    //colour output
    var colour = noColour;
    if(colourText) colour = ( colours[methodMode] );
    if(typeof colour === 'undefined') colour = noColour;
    var date_string = (new Date()).toString();
      
    switch(methodMode) {    
      case 'error':
      case 'warn':
        console.error( colour( name[ process.pid ] + " " + date_string + " " + '[' + methodMode + ']: ' + input ) );
        break;
      case 'debug':
      case 'verbose':
        console.log( colour( name[ process.pid ] + " " + date_string + " " + '[' + methodMode + ']: ' + input ) );
        break;
      default:
        console.log( colour( name[ process.pid ] + " " + date_string + " " + ': ' + input ) );
        break;
    }
  } else if ( typeof( input ) === "function" ) {
    input();
  }
};


var debug = function( input ) {
  if ( 'debug' == mode[ process.pid ] ) {
    logger( input, 'debug' );
  }
};

var log = function( input ) {
  if ( 'standard' == mode[ process.pid ] || 'verbose' == mode[ process.pid ] 
      || 'debug' == mode[ process.pid ] ) {
    logger( input, 'standard' );
  }
};

var error = function( input ) {
  logger( input, 'error' );
};

var stderr = function( input ) {
  if ( typeof( input ) === "string" ) {
    process.stderr.write( input );
  } else if ( typeof( input ) === "function" ) {
    input();
  }
};

var stdout = function( input ) {
  if ( typeof( input ) === "string" ) {
    process.stdout.write( input );
  } else if ( typeof( input ) === "function" ) {
    input(); 
  }
};

var verbose = function( input ) {
  if ( 'verbose' == mode[ process.pid ] || 'debug' == mode[ process.pid ] ) {
    logger( input, 'verbose' );
  }
};

var warn = function( input ) {
  logger( input, 'warn' );
};



//------------------------
// Colour Section
var ENDL = '\x1B[0m';

var blue = function( text ) {
  return '\x1B[0;34m' + text + ENDL;
};

var cyan = function( text ) {
  return '\x1B[0;36m' + text + ENDL;
};

var green = function( text ) {
  return '\x1B[0;32m' + text + ENDL;
};

var red = function( text ) {
  return '\x1B[0;31m' + text + ENDL;
};

var yellow = function( text ) {
  return '\x1B[0;33m' + text + ENDL;
};

var noColour = function( text ) {
  return text;
}

//config for colouring output
colours['error'] = red;
colours['warn'] = yellow;
colours['debug'] = cyan;
colours['verbose'] = green;
colours['standard'] = noColour;



exports.mode = function( loglyMode ) {
  if ( 'standard' === loglyMode || 'verbose' === loglyMode || 'debug' === loglyMode ) {
    mode[ process.pid ] = loglyMode;
  } else {
    throw "Invalid logly mode ( should be one of: standard, verbose, debug )";
  }
};

exports.name = function( applicationName ) {
  name[ process.pid ] = applicationName;
};

exports.colour = function( bColour ) {
  colourText = bColour === true;
};

//I even included this spelling because I'm nice
exports.color = exports.colour;

exports.debug = debug;
exports.error = error;
exports.log = log;
exports.stdout = stdout;
exports.stderr = stderr;
exports.verbose = verbose;
exports.warn = warn;
