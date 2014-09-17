var isEvalEnable = true;
var Joints = require('./Joints');

module.exports = {

	/**
	 * Extend class
	 * @param {object} nameObject
	 * @param {object} parentNameObject
	 * @param {function} [parentClass]
	 * @param {function} [mixins]
	 * @param {object} [prototypeProperties]
	 * @param {object} [staticProperties]
	 * @returns {function} New class
	 */
	extendClass: function (nameObject, parentNameObject, parentClass, mixins, prototypeProperties, staticProperties) {
		parentClass = parentClass || this._noop;
		mixins = mixins || [];

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		var constructor = prototypeProperties && prototypeProperties.hasOwnProperty('constructor') ?
			this._coverVirtual(prototypeProperties.constructor, parentClass) :
			parentClass;
		var childClass = this._createFunction(nameObject, constructor);

		// Add static properties to the constructor function, if supplied.
		for (var prop in parentClass) {
			childClass[prop] = parentClass[prop];
		}
		this._extendWithSuper(childClass, staticProperties);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = this._createFunction(parentNameObject, this._noop);
		Surrogate.prototype = parentClass.prototype;

		childClass.prototype = new Surrogate();

		// Copy objects from child prototype
		for (var prop2 in parentClass.prototype) {
			if (parentClass.prototype.hasOwnProperty(prop2) && prop2 !== 'constructor') {
				childClass.prototype[prop2] = this._clone(parentClass.prototype[prop2]);
			}
		}

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (prototypeProperties) {
			this._extendWithSuper(childClass.prototype, prototypeProperties);
		}

		// Add prototype properties and methods from mixins
		for (var i = 0, l = mixins.length; i < l; i++) {
			for (var mixinProp in mixins[i].prototype) {
				// Skip private
				if (mixinProp.substr(0, 2) === '__') {
					continue;
				}

				// Check for exists property or method. Mixin can only add properties, but no replace it
				if (typeof childClass.prototype[mixinProp] === 'function' || childClass.prototype.hasOwnProperty(mixinProp)) {
					throw new Error('Try to replace prototype property `' + mixinProp + '` in class `' + childClass.__className + '` by mixin `' + mixins[i].__className + '`');
				}
				childClass.prototype[mixinProp] = mixins[i].prototype[mixinProp];
			}
		}
		// Add static properties and methods from mixins
		for (var i = 0, l = mixins.length; i < l; i++) {
			for (var mixinProp in mixins[i]) {
				// Skip private
				if (mixinProp.substr(0, 2) === '__') {
					continue;
				}

				// Check for exists property or method. Mixin can only add properties, but no replace it
				if (typeof childClass[mixinProp] === 'function' || childClass.hasOwnProperty(mixinProp)) {
					throw new Error('Try to replace static property `' + mixinProp + '` in class `' + childClass.__className + '` by mixin `' + mixins[i].__className + '`');
				}
				childClass[mixinProp] = mixins[i][mixinProp];
			}
		}

		return childClass;
	},

	_createFunction: function(nameObject, constructor) {
		if (!isEvalEnable || !nameObject) {
			return function () { return constructor.apply(this, arguments); }
		}

		var name = nameObject.name || 'Function';

		// Filter name
		//name = name || 'Function';
		//name = name.replace(/\(/g, ''); // @todo true validate

		var nameParts = nameObject.globalName.split('.');

		// Create root object
		var rootName = nameParts.shift();
		var currentScope;
		eval('var ' + rootName + ' = currentScope = {};');

		// Create face namespace object
		for (var i = 0; i < nameParts.length; i++) {
			var scopeName = nameParts[i];
			if (!currentScope[scopeName]) {
				currentScope[scopeName] = {};
			}
			currentScope = currentScope[scopeName];
		}

		var func;
		eval('func = ' + nameObject.namespace + '.' + name + ' = function () { return constructor.apply(this, arguments); }');
		return func;

	},

	_filterClassName: function (name) {
		return name;
	},

	_extendWithSuper: function (childClass, newProperties) {
		if (!newProperties) {
			return;
		}

		// Extend and setup virtual methods
		for (var key in newProperties) {
			if (!newProperties.hasOwnProperty(key)) {
				continue;
			}

			var value = newProperties[key];
			if (typeof value == 'function' && typeof childClass[key] == 'function' && childClass[key] !== this._noop) {
				childClass[key] = this._coverVirtual(value, childClass[key]);
			} else {
				childClass[key] = this._clone(value);
			}
		}

		// Default state
		if (!childClass.__super) {
			childClass.__super = this._noop;
		}
	},

	/**
	 *
	 * @type {Function}
	 */
	_noop: function() {
	},

	_clone: function(obj) {
		if (!obj || typeof obj !== "object") {
			return obj;
		}

		var copy = obj.constructor();
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				copy[key] = this._clone(obj[key]);
			}
		}
		return copy;
	},

	_coverVirtual: function (childMethod, parentMethod) {
		var s = '__super';
		var c = childMethod;
		var p = parentMethod;

		return function () {var o = this[s];this[s] = p;var r = c.apply(this, arguments);this[s] = o;return r;};
	}

};

