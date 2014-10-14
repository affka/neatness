
var extendClass = require('./extendClass');
var formats = require('./formats');

// For .noConflict() implementation
var hasPreviousJoints = typeof window !== 'undefined' && window.hasOwnProperty('Joints');
var previousJoints = hasPreviousJoints ? window.Joints : null;

/**
 * Joints class
 * @function Joints
 */
var Joints = function() {

	/**
	 *
	 * @type {object}
	 */
	this.context = {};
};

/**
 * @function Joints.prototype.newContext
 * @param {boolean} [removeGlobal] Set true for remove Joints object from window (browser global object)
 * @returns {Joints}
 */
Joints.prototype.newContext = function(removeGlobal) {
	removeGlobal = removeGlobal || false;

	if (removeGlobal) {
		this.noConflict();
	}

	return new Joints();
};

/**
 * @function Joints.prototype.noConflict
 * @returns {Joints}
 */
Joints.prototype.noConflict = function() {
	// Root namespace object
	var root = typeof window !== 'undefined' ? window : {};

	if (hasPreviousJoints) {
		root.Joints = previousJoints;
	} else {
		delete root.Joints;
	}

	return this;
};

/**
 * @function Joints.prototype.namespace
 * @param {string} name Full namespace name
 * @returns {object}
 */
Joints.prototype.namespace = function (name) {
	name = name || '';

	var nameParts = name.split('.');
	var currentScope = this.context;

	// Find or create
	for (var i = 0; i < nameParts.length; i++) {
		var scopeName = nameParts[i];

		if (!currentScope[scopeName]) {
			currentScope[scopeName] = {
				__className: nameParts.slice(0, i).join('.'),
				__parentClassName: null
			};
		}
		currentScope = currentScope[scopeName];
	}

	return currentScope;
};

/**
 * Method for define class
 * @function Joints.prototype.createClass
 * @param {string} globalName
 * @param {(function|object|null)} optionsOrExtend
 * @param {object} [prototypeProperties]
 * @param {object} [staticProperties]
 * @return {object}
 */
Joints.prototype.createClass = function (globalName, optionsOrExtend, prototypeProperties, staticProperties) {
	var params = formats.parseFormat(globalName, optionsOrExtend, prototypeProperties, staticProperties);

	// Show error if not defined extended class
	if (params[2] !== null && typeof params[2] !== 'function') {
		throw new Error('Not found extend class for `' + globalName + '`.');
	}

	var newClass = extendClass(params[0], params[1], params[2], params[6], params[3], params[4]);
	formats.applyClassConfig(newClass, params[5], params[0], params[1]);

	return newClass;
};

/**
 * Method for define class
 * @function Joints.prototype.defineClass
 * @param {string} globalName
 * @param {(function|object|null)} optionsOrExtend
 * @param {object} [prototypeProperties]
 * @param {object} [staticProperties]
 * @return {object}
 */
Joints.prototype.defineClass = function (globalName, optionsOrExtend, prototypeProperties, staticProperties) {
	var newClass = this.createClass.apply(this, arguments);
	var nameObject = formats.parseFullName(globalName);

	this.namespace(nameObject.namespace)[nameObject.name] = newClass;
	return newClass;
};

var joints = module.exports = new Joints();

// Web browser export
if (typeof window !== 'undefined') {
	window.Joints = joints;
}

/**
 * @type {Joints.prototype.Object}
 */
Joints.prototype.Object = require('./Joints.Object')(joints);

/**
 * @type {Joints.prototype.Exception}
 */
Joints.prototype.Exception = require('./Joints.Exception')(joints);
