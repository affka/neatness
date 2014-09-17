
var utils = require('./utils');
var formats = require('./formats');

// Root namespace object
var root = typeof window !== 'undefined' ? window : {};

// For .noConflict() implementation
var hasPreviousJoints = typeof window !== 'undefined' && window.hasOwnProperty('Joints');
var previousJoints = hasPreviousJoints ? window.Joints : null;

var Joints = module.exports = {};

// Web browser export
if (typeof window !== 'undefined') {
	window.Joints = Joints;
}

/**
 *
 * @returns {Joints}
 */
Joints.noConflict = function() {
	if (hasPreviousJoints) {
		root.Joints = previousJoints;
	} else {
		delete root.Joints;
	}

	return this;
};

/**
 *
 * @param {string} name Full namespace name
 * @returns {object}
 */
Joints.namespace = function (name) {
	name = name || '';

	var nameParts = name.split('.');
	var currentScope = root;

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
 *
 * @param {string} globalName
 * @param {(function|object|null)} optionsOrExtend
 * @param {object} [prototypeProperties]
 * @param {object} [staticProperties]
 * @return {object}
 */
Joints.createClass = function (globalName, optionsOrExtend, prototypeProperties, staticProperties) {
	var params = formats.parseFormat(globalName, optionsOrExtend, prototypeProperties, staticProperties);

	// Show error if not defined extended class
	if (params.parentClass !== null && typeof params.parentClass !== 'function') {
		throw new Error('Not found extend class for `' + globalName + '`.');
	}

	var newClass = utils.extendClass(params.nameObject, params.parentNameObject, params.parentClass, params.mixins, params.prototypeProperties, params.staticProperties);
	formats.applyClassConfig(newClass, params);

	return newClass;
};

/**
 * Method for define class
 *
 * @param {string} globalName
 * @param {(function|object|null)} optionsOrExtend
 * @param {object} [prototypeProperties]
 * @param {object} [staticProperties]
 * @return {object}
 */
Joints.defineClass = function (globalName, optionsOrExtend, prototypeProperties, staticProperties) {
	var params = formats.parseFormat(globalName, optionsOrExtend, prototypeProperties, staticProperties);

	// Show error if not defined extended class
	if (params.parentClass !== null && typeof params.parentClass !== 'function') {
		throw new Error('Not found extend class for `' + globalName + '`.');
	}

	var newClass = utils.extendClass(params.nameObject, params.parentNameObject, params.parentClass, params.mixins, params.prototypeProperties, params.staticProperties);
	formats.applyClassConfig(newClass, params);

	this.namespace(params.nameObject.namespace)[params.nameObject.name] = newClass;

	return newClass;
};

/**
 * @type {Joints.Object}
 */
Joints.Object = require('./Joints.Object')(Joints);

/**
 * @type {Joints.Exception}
 */
Joints.Exception = require('./Joints.Exception')(Joints);
