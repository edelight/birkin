var assert = require('assert');
var Bag = require('./../index');

describe('birkin', function(){

	it('stores values via get/set', function(){
		var bag = new Bag();
		bag.set('foo', 'bar');
		bag.set({
			rofl: 'lol'
			, christ: 'is risen'
		});
		bag.set({
			even: 'more'
		}, {
			forever: 'ever'
		});
		bag.set('arr', [1, 2, 3]);
		assert.equal(bag.get('foo'), 'bar');
		assert.equal(bag.get('rofl'), 'lol');
		assert.equal(bag.get('christ'), 'is risen');
		assert.equal(bag.get('even'), 'more');
		assert.equal(bag.get('forever'), 'ever');
		assert.deepEqual(bag.get('arr'), [1, 2, 3]);
		assert.deepEqual(bag.get(), {
			foo: 'bar'
			, rofl: 'lol'
			, christ: 'is risen'
			, arr: [1, 2, 3]
			, even: 'more'
			, forever: 'ever'
		});
	});

	it('properly handles falsy values', function(){
		var bag = new Bag();
		bag.set('foo', false);
		bag.set('bar', null);
		bag.set({baz: 0, qux: undefined});
		bag.set('qux', true);
		bag.set('foo', 'string');
		assert.strictEqual(bag.has(), true);
		assert.strictEqual(bag.has('foo'), true);
		assert.strictEqual(bag.has('bar'), true);
		assert.strictEqual(bag.has('baz'), true);
		assert.strictEqual(bag.has('qux'), true);
		assert.strictEqual(bag.get('foo'), false);
		assert.strictEqual(bag.get('bar'), null);
		assert.strictEqual(bag.get('baz'), 0);
		assert.strictEqual(bag.get('qux'), undefined);
	});

	it('acts immutable', function(){
		var bag = new Bag();
		bag.set('bar', 'bar');
		bag.set('bar', 'baz');
		bag.set({ bar: 'foo', 'foo': 2 });
		assert.equal(bag.get('bar'), 'bar');
		assert.equal(bag.get('foo'), 2);
		var data = bag.get();
		data.bar = 'baz';
		bag = new Bag(data);
		assert.equal(bag.get('bar'), 'baz');
		var something = {some: 'thing'};
		bag.set(something);
		something.some = 'the void';
		assert.equal(bag.get('some'), 'thing');
	});

	it('returns copies to prevent accidental mutation', function(){
		var bag = new Bag();
		bag.set('rofl', 'lol');
		var copy = bag.get();
		copy.rofl = 'so sad';
		assert.notDeepEqual(copy, bag.get());
		bag.set('obj', {foo: 'bar'});
		var obj = bag.get('obj');
		obj.foo = 'mutated';
		assert.deepEqual(bag.get('obj'), {foo: 'bar'});
		assert.notDeepEqual(bag.get('obj'), obj);
		bag.set('arr', [1, 2, 3]);
		var arr = bag.get('arr');
		arr[1] = 'string';
		assert.deepEqual(bag.get('arr'), [1, 2, 3]);
		assert.notDeepEqual(bag.get('arr'), arr);
	});

	it('can access nested values', function(){
		var bag = new Bag();
		bag.set('baz', {
			foo: {
				bar: 12
			}
		});
		assert.equal(bag.get('baz', 'foo', 'bar'), 12);
	});

	it('can safely access non-existing keys', function(){
		var bag = new Bag();
		bag.set('you&me', 'everyone we know');
		assert.strictEqual(bag.get('sth'), undefined);
		assert.strictEqual(bag.get('nesting', 'lots', 'of', 'keys'), undefined);
		assert.doesNotThrow(function(){
			bag.get('you', 'wont', 'find', 'me');
		});
		assert.equal(bag.get('you&me'), 'everyone we know');
	});

	it('can check for the existence of keys', function(){
		var bag = new Bag();
		assert.equal(bag.has(), false);
		bag.set('foo', 'bar');
		assert.equal(bag.has(), true);
		assert.equal(bag.has('foo'), true);
		assert.equal(bag.has('bar'), false);
		bag.set('baz', {
			foo: {
				bar: 12
			}
		});
		assert.equal(bag.has('baz', 'foo', 'bar'), true);
		assert.equal(bag.has('baz', 'foo', 'qux'), false);
		assert.doesNotThrow(function(){
			bag.get('i-dont-exist');
			bag.get('i-dont-exist', 'even', 'when', 'nested');
		});
	});

	it('can be initialized without data', function(){
		var bag = new Bag();
		assert.strictEqual(bag.has(), false);
		var counterfeitBag = new Bag('foo bar');
		assert.strictEqual(counterfeitBag.has(), false);
	});

	it('can be prepopulated with data', function(){
		var bag = new Bag({
			old: 'data'
			, initialized: true
		});
		assert.strictEqual(bag.has(), true);
		assert.equal(bag.get('old'), 'data');
		assert.strictEqual(bag.get('initialized'), true);
		var otherBag = new Bag({one: 1}, 'random string', {two: 2});
		assert.equal(otherBag.get('one'), 1);
		assert.deepEqual(otherBag.get(), {one: 1, two: 2});
	});

	it('zips passed objects right to left', function(){
		var prepopulated = new Bag({foo: 'bar'}, {foo: 'baz'});
		assert.equal(prepopulated.get('foo'), 'baz');
		var empty = new Bag();
		empty.set({one: 2}, {one: 1});
		assert.equal(empty.get('one'), 1);
	});

});
