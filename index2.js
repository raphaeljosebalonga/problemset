'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lib = require('./lib/lib');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

/*
 *
 *  PROBLEM 3: RESOURCE POOLING
 *
 */

var advancedPool = require('advanced-pool');

var ResourceManager = function () {
    function ResourceManager(count) {
        _classCallCheck(this, ResourceManager);

        this.count = count;
        this.curr = 0;
        this.resources = 1;
        this.resource;
        var self = this;
        this.pull = new advancedPool.Pool({
            min: this.count,
            max: this.count,
            create: function create(callback) {
                var resource = { name: "Resource #" + self.resources };
                callback(null, resource);
                self.resources++;
            }
        });
    }

    _createClass(ResourceManager, [{
        key: 'borrow',
        value: function borrow(callback) {
            this.curr++;
            var pool = this.pull,
                self = this;

            var fn = function fn(err, resource) {
                if (err) {
                    console.log(err);
                } else {
                    self.resource = resource;
                    callback(self);
                }
            };
            pool.acquire(fn.bind({ id: this.curr }));
        }
    }, {
        key: 'release',
        value: function release() {
            var pool = this.pull;
            pool.release(this.resource);
        }
    }, {
        key: 'close',
        value: function close() {
            var pool = this.pull;
            pool.close();
        }
    }]);

    return ResourceManager;
}();

var pool = new ResourceManager(2);
console.log('START');

var timestamp = Date.now();

pool.borrow(function (res) {
    console.log('RES: 1');

    setTimeout(function () {
        res.release();
    }, 500);
});

pool.borrow(function (res) {
    console.log('RES: 2');
});

pool.borrow(function (res) {
    console.log('RES: 3');
    console.log('DURATION: ' + (Date.now() - timestamp));
});
