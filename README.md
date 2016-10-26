# birkin

[![Build Status](https://travis-ci.org/edelight/birkin.svg?branch=master)](https://travis-ci.org/edelight/birkin)

> simple and **immutable** key/value-bag for storing session and configuration data in client-side applications

### Installation

```sh
$ npm install birkin --save
```

In ES5:
```js
var Bag = require('birkin');
var sessionbag = new Bag();
```

Using Babel / ES6:
```js
import Bag from 'birkin';
const sessionbag = new Bag();
```

### API

##### `Constructor(objects...)`

The instance can be passed any number of objects on instantiation that will serve as base data:
```js
var emptyBag = new Bag();
var prepopulated = new Bag({key: 'value'});
var numbers = new Bag({one: 1}, {two: 2}, {three: 3});
```

##### `set(key, value)`

Associates any value with the given key:
```js
var sessionbag = new Bag();
sessionbag.set('some-string', 'Christ is risen');
sessionbag.set('some-array', ['foo', 'bar', 'baz']);
```

##### `set(objects...)`

Merges the given object into the store:
```js
var sessionbag = new Bag();
sessionbag.set({a: 1, b: 2, c: 3});
sessionbag.set({d: 4}, {e: 5});
```

##### `get(key)`

Retrieves a value by the given key:
```js
sessionbag.set('message', 'Christ is risen');
sessionbag.get('message'); // => 'Christ is risen'
sessionbag.get('notset'); // => undefined
```

##### `get(keys...)`

Retrieves a value inside a stored object:
```js
var sessionbag = new Bag();
sessionbag.set('nested', { christ: { is: {risen: 'not too sure' } } });
sessionbag.get('nested', 'christ', 'is', 'risen'); // => 'not too sure'
```

##### `get()`

Retrieves the store as an object:
```js
var sessionbag = new Bag();
sessionbag.set('foo', 'bar');
sessionbag.get(); // => {foo: 'bar'}
```

##### `has(key)`

Checks if the given key exists:
```js
var sessionbag = new Bag();
sessionbag.set('foo', 'bar');
sessionbag.has('foo'); // => true
sessionbag.has('bar'); // => false
```

##### `has()`

Checks if the instance contains any keys:
```js
var sessionbag = new Bag();
sessionbag.has(); // => false
sessionbag.set('foo', 'bar');
sessionbag.has(); // => true
```


### Immutability

`birkin` is designed to be immutable. Keys cannot be overridden or unset. Returned values will be clones. This enforces well designed data structures and handling.
```js
var sessionbag = new Bag();
sessionbag.set('foo', 'bar');
sessionbag.set('foo', 'baz');
sessionbag.set({ foo: 'qux', bar: 'foo'});
sessionbag.get(); // => {foo: 'bar', bar: 'foo'}
sessionbag.set('obj', {a: 'b'});
var obj = sessionbag.get('obj');
obj.a = 'c';
sessionbag.get('obj'); // => {a: 'b'}
```

If you are sure that mutating values is the right approach for your problem at hand, do so explicitly:
```js
var sessionbag = new Bag({key: 'value'});
var data = sessionbag.get();
data.key = 'updated value';
sessionbag = new Bag(data);
sessionbag.get('key'); // => 'updated value'
```


### License
MIT © [Frederik Ring](http://www.frederikring.com)
