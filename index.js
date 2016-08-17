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


/*
 *
 *  PROBLEM 2: STREAMS
 *
 */


var util = require('util'),
    events = require('events');

function RandStringSource(stream) {
    this.stream = stream;
    let self = this;

    let string = '';
    events.EventEmitter.call(this);

    stream.on('data', (data) => {
        data.split('').forEach(function(c) {
            if(c == '.') {
                self.emit('data', string);
                string = '';
            }
            else
                string += c;
        });

    });

}

util.inherits(RandStringSource, events.EventEmitter);

let source = new RandStringSource(new RandStream());

source.on('data', (data) => {
    console.log(data);
})



