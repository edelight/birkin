var __is = function(type){
	return function(el){
		return Object.prototype.toString.call(el) === '[object ' + type + ']';
	};
};
var _isObject = function(el){
	if (!el) return false;
	return !(el.constructor
		&& !Object.prototype.hasOwnProperty.call(el, 'constructor')
		&& !Object.prototype.hasOwnProperty.call(el.constructor.prototype, 'isPrototypeOf'));
};
var _isString = __is('String');
var _slice = function(el, index){
	return Array.prototype.slice.call(el, index);
};
var _zip = function(/*args...*/){
	return _slice(arguments)
		.filter(_isObject)
		.reduce(function(result, nextObject){
			for (var key in nextObject){
				if (nextObject.hasOwnProperty(key)){
					result[key] = nextObject[key];
				}
			}
			return result;
		}, {});
};
var _clone = function(el){
	return _isObject(el)
		? _zip(el)
		: (Array.isArray(el) ? el.slice() : el);
};

function Bag(/*args...*/){
	// enfore data privacy by **not** attaching
	// the object to the instance
	var store = _zip.apply(null, _slice(arguments));

	this.get = function(/*keys...*/){
		if (arguments.length === 1){
			return _clone(store[arguments[0]]);
		} else if (arguments.length){
			// walk the given keys and try to find the
			// nested property
			// return undefined if not found
			return _clone(_slice(arguments).reduce(function(current, nextKey){
				return _isObject(current) ? current[nextKey] : undefined;
			}, store));
		} else {
			return _clone(store);
		}
	};

	this.set = function(key, value){
		if (_isString(key)){
			store[key] = key in store ? store[key] : value;
		} else {
			var args = _slice(arguments);
			args.push(store);
			// since store is the rightmost argument
			// we can guarantee immutability when extending
			store = _zip.apply(null, args);
		}
	};

	this.has = function(key/*, nested...*/){
		if (!key){
			return Object.keys(store).length > 0;
		} else if (arguments.length > 1){
			var data = this.get(key);
			return _slice(arguments, 1).reduce(function(result, key){
				var next = result ? key in data : false;
				data = data[key] || {};
				return next;
			}, true);
		}
		return key in store;
	};
}

module.exports = Bag;
