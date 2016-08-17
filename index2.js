'use strict';

var _lib = require('./lib/lib');

//import "babel-polyfill"

'use strict';

/*
 *
 *  PROBLEM 1: ASYNCHRONOUS OPERATIONS
 *
 */

function doAsync(input) {
    input.map(function (x) {
        if (Array.isArray(x)) x.map(function (y) {
            return (0, _lib.asyncOp)(y);
        });else (0, _lib.asyncOp)(x);
    });
}

var input = ['A', ['B', 'C', 'D', 'E'], 'F', 'G', ['H', 'I']];

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
    var self = this;

    var string = '';
    events.EventEmitter.call(this);

    stream.on('data', function (data) {
        data.split('').forEach(function (c) {
            if (c == '.') {
                self.emit('data', string);
                string = '';
            } else string += c;
        });
    });
}

util.inherits(RandStringSource, events.EventEmitter);

var source = new RandStringSource(new _lib.RandStream());

source.on('data', function (data) {
    console.log(data);
});
