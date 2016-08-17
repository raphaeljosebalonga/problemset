import { RandStream, asyncOp } from './lib/lib'
//import "babel-polyfill"

'use strict';


/*
 *
 *  PROBLEM 1: ASYNCHRONOUS OPERATIONS
 *
 */

function doAsync(input) {
    input.map(x => {
        if(Array.isArray(x))
            x.map(y => asyncOp(y))
        else
            asyncOp(x)
    });
}

let input = [
  'A',
  [ 'B', 'C', 'D', 'E' ],
  'F',
  'G',
  [ 'H', 'I' ]
]

doAsync(input);