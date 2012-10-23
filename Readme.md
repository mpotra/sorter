# sorter (v0.1.2)

sorts an array of objects, based on their properties

## CHANGELOG

### v0.1.2
  * Added converter support
  * Converters: lc, up
    
  E.g. *.sort(['lc(name)',-1])* sorts by *toLowerCase( property_value )* of *name* property
    

## FEATURES
 * Allows sorting single-value arrays
 * Allows sorting arrays comprised of objects
 * Uses String.prototype.localCompare() for string comparison
 * Can compare objects, based on their toString()
 * Accepts multiple sort levels
 * Simple, array-based or object-based syntax for sorting
 * Optimizes sorting, by using the Schwartzian Transform technique

## REQUIRES
 * Array.isArray
 * Array.prototype.forEach
 
## EXAMPLE USAGE

### First example

```javascript
var obj1    = { name: { first: 'Mike', last: 'Potra' }, age: 27, gender: 'male' };
var obj2    = { name: { first: 'John', last: 'Doe' }, age: 25, gender: 'male' };
var obj3    = { name: { first: 'Jane', last: 'Doe' }, age: 34, gender: 'female' };
var myArray = [ obj1, obj2, obj3 /*, ..., objN */ ]; //your array of objects goes here
var Sorter 	= require("./path/to/sorter");

var sorter 	      = new Sorter( myArray, [ ['gender', -1], ['age', -1] ] );
var sorted_array  = sorter.sort(); 
```

The second parameter *[ ['gender', -1], ['age', -1] ]* gives two levels of sorting,
first by gender descending, and secondly by age descending.
**sorted_array** would result in the following order of the objects

```
sorted_array => [
                  obj3  ( female )
                  obj1  ( male, 27 )
                  obj2  ( male, 25 )
               ]
```

*Items in the array are sorted first by gender, and where same gender they get sorted
by the second level, which is by age*

### Second example

```javascript
var sorter        = new Sorter( myArray, [ ['name.last'], ['name.first', 1] ] );
var sorted_array  = sorter.sort();
```

Items in the array are sorted by *name.last* ascending (ascending implied, even if the direction parameter is missing), and then 
by *name.first*.
Results:
```
sorted_array  =>  [
                    obj3  ( Doe,    Jane )
                    obj2  ( Doe,    John )
                    obj1  ( Potra,  Mike )
                  ]
```
## WARNING

The sorter will modify the array being sorted, and will return the modified array. *Similarly to how __Array.prototype.sort__ does*
To obtain a new array with the sorted elements, and keep the original array intact, use the __noReplace__ parameter

## Sorter.sort( noReplace )

Sorts the array, and returns the sorted *(modified)* array.
Calling the function with __noReplace__ set to *false*, will leave the original array intact and return a new 
array with the items sorted.

## SYNTAX

See *sorter.test.js* for syntax and sample

## IMPLEMENTATION

The sorter is available as a separate class with one function __.sort()__ for usage in multiple scenarios.
Example of how to extend an array object with the sorter:

```javascript
  var myArray = [];
  myArray.sort = function() {
    var args    = Array.prototype.slice.call( arguments ); //convert arguments into a proper Array
    var sorter = new Sorter( this, args );
    return sorter.sort();
  }
```

## TODO
  * Update the documentation 
  * Explain all available syntax variants
  * Include more examples
  * Explain the role of Sorter.Normalizer (syntax converter)
  * Update source with Direction, and expose it
  * Clean-up the code and add comments

