/*! Media Library
 * Copyright(c) 2012 Mihai-Alexandru Potra <mike@mpotra.com>
 * Date: 20 October 2012
 *
 * MIT Licensed
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var key_converters  = {
  'lc': function(v) { return ( typeof v == 'string' ? v.toLowerCase() : v ); },
  'uc': function(v) { return ( typeof v == 'string' ? v.toUpperCase() : v ); },
};
 
var findSpecialKey = function( name ) {
  var res = { 'name': name, 'fn': null };
  if( typeof name == 'string' && name != '' ) {
    var matches = name.match(/^([A-z0-9\-\_\.]+)\(([A-z0-9\-\_\.\[\]]+)\)$/i);
    if( matches ) {
      res.fn    = matches[1];
      res.name  = matches[2];
    }
  }
  return res;
}
 
var keyValue = function( obj, keyName ) {
  if( typeof obj == 'object' && obj != null && typeof keyName == 'string' ) {
    if( ( dot = keyName.indexOf('.') ) >= 0 ) {
      return keyValue( obj[ keyName.substr( 0, dot ) ], keyName.substr( dot + 1 ) );
    } else {
      return ( typeof obj[keyName] != 'undefined' ? obj[keyName] : undefined );
    }
  }
};

var compare = function(a,b) {
  if( typeof a == 'string' && typeof b == 'string' ) {
    return a.localeCompare( b );
  } else if ( typeof a == 'number' || typeof a == 'boolean' ) {
    return ( a < b ? -1 : ( a == b ? 0 : 1 ) );
  } else if ( typeof a == 'object' && typeof b == 'object' ) {
    if( typeof a.equals == 'function' ) {
      return a.equals( b );
    } else {
      //return a.toString().localeCompare( b.toString() );
      return ( a < b ? -1 : ( a == b ? 0 : 1 ) );
    }
  } else {
    return 1;
  }
}

var SortItem = function( index, value ) {
  this.index  = index;
  this.value  = value;
  return this;
}
SortItem.prototype.index = null;
SortItem.prototype.value = null;

/*
var _eval_directions = function( direction, default_dir ) {
  default_dir = default_dir ? default_dir : 0; //default direction
  var d  = default_dir; //init d
  
  if( typeof direction =='object' && Array.isArray( direction ) ) {
    //array of directions. E.g. [ -1, -1, 0, 'desc', 'none', 'asc', 'equal', 1, true, 2, false, -2 ]
    for( var i = 0, directions = []; i < direction.length; i++ ) {
      directions[i] = _eval_directions( direction[i], default_dir );
    }
    return directions; //skip the rest of the function
  } else {
    d = direction; //continue with the rest of the function
  }
  
  //reaching here means we have no array, just a single direction
  if( typeof d == 'number' || typeof d == 'boolean' ) {
    // d is of -2, -1, 0 (false), 1 (true), 2
    // mozilla uses -2, 0, 2  (?)
    return ( d == 0 ? 0 : ( d < 0 ? -1 : 1 ) );
  } else if ( typeof d == 'string' ) {
    //d is string
    if( d === '' + parseInt(d) + '' ) {
      //d is of '-2', '-1', '0', '1', '2'
      return ( d == 0 ? 0 : ( d < 0 ? -1 : 1 ) );
    } else {
      //d is of 'desc', 'descending', 'asc', 'ascending'
      return ( d == 'desc' || d == 'descending' ? -1 : ( d == 'asc' || d == 'ascending' ? 1 : default_dir ) );
    }
  } else {
    //d is not a direction, return default
    return default_dir;
  }
}

var Direction = function( direction, default_dir ) {
  //build the direction || directions list
  this.default_dir  = ( default_dir ? default_dir : this.default_dir );
  this.direction    = _eval_directions( direction, this.default_dir );
  return this;
}
Direction.prototype.direction   = null;
Direction.prototype.default_dir = 0;
Direction.prototype.get = function(i) {
  if( typeof this.direction == 'object' && this.direction != null && Array.isArray( this.direction ) ) {
    return ( i >= 0 && i < this.direction.length ? this.direction[i] : this.default_dir );
  } else {
    return this.direction;
  }
}
Direction.prototype.compare = function( a, b ) {
  //TODO
}
*/

var Normalizer = function() {
  this.keys       = [];
  this.directions = [];
  if( arguments.length > 0 ) {
    this.normalize.apply( this, arguments );
  }
  return this;
}
Normalizer.prototype.keys       = null;
Normalizer.prototype.directions = null;
Normalizer.prototype.isDirection = function( arg ) {
  if( typeof arg == 'number' ) {
    return true;
  } else if( typeof arg == 'string' ) {
    var arg_r = arg.replace(' ','');
    return( '' + parseInt(arg_r) + '' == arg_r ? true : false );
  } else {
    return false;
  }
}
Normalizer.prototype.getDirection = function(i) {
  if( typeof this.directions == 'object' && this.directions != null && Array.isArray( this.directions ) ) {
    return ( i >= 0 && i < this.directions.length ? this.directions[i] : 0 );
  } else {
    return this.directions;
  }
}

Normalizer.prototype.normalize = function( ) {
  return this._normalizeArray( Array.prototype.slice.call(arguments) );
}

Normalizer.prototype._normalizeArray = function( args, prepend ) {
  prepend = typeof prepend == 'string' && prepend != '' ? prepend : '';
  var arg     = null;
  if( Array.isArray( args ) ) {
    while( arg = args.shift() ) {
      if ( this.isDirection( arg ) ) {
        this.directions.push( arg );
      } else if ( typeof arg == 'string' ) {
        //check next
        if( args.length > 0 ) {
          if( this.isDirection( args[0] ) ) {
            this.keys.push( ( prepend != '' ? prepend + '.' + arg : arg ) );
            this.directions.push( typeof args[0] == 'string' ? parseInt(args.shift()) : args.shift() );
          } else if ( typeof args[0] == 'object' ) {
            //this.keys.push( arg ); //not needed, concatenated on next pass
            this._normalizeArray( args.shift(), ( prepend != '' ? prepend + '.' + arg : arg ) );
          } else {
            this.keys.push( ( prepend != '' ? prepend + '.' + arg : arg )  );
            this.directions.push( 1 );
          }
        } else {
          this.keys.push( ( prepend != '' ? prepend + '.' + arg : arg )  );
          this.directions.push( 1 );
        }
      } else if ( typeof arg == 'object' ) {
        this._normalizeArray( arg, prepend );
      }
    }
  } else if( typeof args == 'object' && args != null ) {
    if( Array.isArray( args ) ) {
      this._normalizeArray.call( this, args, prepend );
    } else {
      var self = this;
      Object.keys( args ).forEach( function( keyName, index, arr ) {
        self._normalizeArray( [ keyName, args[keyName] ], prepend );
      });
    }
  }
  return this;
}



var Sorter = function( arr, sortArray ) {
  this.map    = [];
  this.array  = arr;
  this.converters = Object.create( key_converters );
  this.normalizer = new Normalizer();
  this.normalizer.normalize.apply( this.normalizer, sortArray );
  if( this.normalizer.keys.length ) {
    this._buildMap();
  }
  return this;
}
Sorter.prototype = {};
Sorter.prototype.map        = null;
Sorter.prototype.array      = null;
Sorter.prototype.normalizer = null;
Sorter.prototype._buildMap  = function( keys ) {
  //building for the Schwartzian Transform
  keys = Array.isArray(keys) ? keys : this.normalizer.keys;
  for( var i = 0; i < this.array.length; i++ ) {
    var values  = [];
    for( var k = 0; k < keys.length; k++ ) {
      var sk  = findSpecialKey( keys[k] );
      if( sk.fn ) {
        if( typeof this.converters[ sk.fn ] == 'function' ) {
          values.push( this.converters[ sk.fn ].call( this, keyValue( this.array[i], sk.name ) ) );
        } else {
          values.push( keyValue( this.array[i], sk.name ) );
        }
      } else {
        //key has no functions
        values.push( keyValue( this.array[i], keys[k] ) );
      }
    }
    this.map.push( new SortItem( i, values ) );
  }
}
Sorter.prototype.sort = function( noReplace ) {
  var sorted = this.map.sort( (function(sorter) {
    return function(a,b) {
      if( Array.isArray( a.value ) && Array.isArray( b.value ) ) {
        var c = compare( a.value[0], b.value[0] ) * sorter.normalizer.getDirection(0);
        if( c == 0 ) {
          for(var i = 1; i < a.value.length ; i++ ) {
            c = compare( a.value[i], b.value[i] )  * sorter.normalizer.getDirection(i);
            if( c != 0 ) return c;
          }
          return 0;
        } else {
          return c;
        }
      } else {
        return compare( a.value, b.value ) * sorter.normalizer.getDirection(0);
      }
    };
  })(this));
  
  var original  = this.array; //original array
  var result =( noReplace == true
                ? (function(sorter){
                      //copy all original values to a separate arr,
                      //before clearing the original array
                      original = [];
                      sorter.array.forEach(function(v,i,arr) { original[i] = v; });
                      sorter.array.length = 0;
                      return sorter.array; 
                  })(this)
                : [] );
  //copy original array based on sorted indexes
  sorted.forEach((function(sorter, result) {
    return function(value, i, arr) {
      result[i] = original[ value.index ];
    };
  })(this, result));
  return result;
}

Sorter.Normalizer = Normalizer;

module.exports = Sorter;
module.exports.version  = '0.1.2';