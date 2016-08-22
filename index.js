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

/*
 *
 *  PROBLEM 3: RESOURCE POOLING
 *
 */

var advancedPool = require('advanced-pool');

class ResourceManager {
    constructor(count) {
        this.count = count;
        this.curr = 0;
        this.resources = 1;
        this.resource;
        let self = this;
        this.pull = new advancedPool.Pool({
            min: this.count,
            max: this.count,
            create: function(callback) {
                var resource = {name: "Resource #" + self.resources};
                callback(null, resource);
                self.resources++;
            }
        })
    }

    borrow(callback) {
        this.curr++;
        let pool = this.pull
        , self = this;

        let fn = function (err, resource) {
            if (err) {
                console.log(err);
            } else {
                self.resource = resource;
                callback(self);
            }
        };
        pool.acquire(fn.bind({ id: this.curr }));
    }

    release() {
        let pool = this.pull;
        pool.release(this.resource);
    }

    close() {
        let pool = this.pull;
        pool.close();
    }
}

let pool = new ResourceManager(2);
console.log('START');

let timestamp = Date.now();

pool.borrow((res) => {
  console.log('RES: 1');

  setTimeout(() => {
    res.release();
  }, 500);
});

pool.borrow((res) => {
  console.log('RES: 2');
});

pool.borrow((res) => {
  console.log('RES: 3');
  console.log('DURATION: ' + (Date.now() - timestamp));
});



