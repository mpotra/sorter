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
var Sorter      = require('./sorter');
var Normalizer  = Sorter.Normalizer;

var normalizer = new Normalizer();  normalizer.normalize(-1);                         console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize('name',-1);                  console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize('name','-1');                console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize('name','age');               console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize('name',1,'name.first',-1);   console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize('name','age',-1);            console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize(['name',['first',-2]],['age']);           console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize(['name'],['age']);           console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize(['name'],['age',-1]);        console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize([['name',-1],['age',1]]);    console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize({'name.first':-1,'age':1});  console.log( normalizer );
normalizer = new Normalizer();      normalizer.normalize({'name':{'first':-1,'last':-2},'age':1,'location':{'city':{'location':2}}});           console.log( normalizer );

var x = [ { 'name': { 'first': 'Mike', 
                      'last': 'Potra' }, 
            'age': 27, 
            'location': { 
                        'city':'Cluj-Napoca', 
                        'state':  {
                                  'name':'Cluj',
                                  'country':'Romania'
                                  }
                        }
          },
          { 'name': { 'first': 'Andrei', 
                      'last': 'Potra' }, 
            'age': 25, 
            'location': { 
                        'city':'Cluj-Napoca', 
                        'state':  {
                                  'name':'Cluj',
                                  'country':'Romania'
                                  }
                        }
          },
          { 'name': { 'first': 'Ana', 
                      'last': 'Maria' }, 
            'age': 27, 
            'location': { 
                        'city':'Bucharest', 
                        'state':  {
                                  'name':'Ilfov',
                                  'country':'Romania'
                                  }
                        }
          },
          { 'name': 'Zaharia', 
            'age': 27, 
            'location': { 
                        'city':'Bucharest', 
                        'state':  {
                                  'name':'Ilfov',
                                  'country':'Romania'
                                  }
                        }
          },
          { 'name': { 'first': 'Gheorghe', 'last': 'Potra' },
            'age': 60, 
            'location': { 
                        'city':'Bucharest', 
                        'state':  {
                                  'name':'Ilfov',
                                  'country':'Romania'
                                  }
                        }
          },
        ];

        var z = {'x': x};
        
var s = new Sorter( z.x, [{'name': {'last':1},'age':-1}] );
console.log(s.sort());
console.log('---original----');
console.log(x);