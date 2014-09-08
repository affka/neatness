var FORMAT_JOINTS_V02 = 'joints_v02';
var FORMAT_JOINTS_V10 = 'joints_v10';

module.exports = {

	/**
	 * Detect format and return class params
	 * @param {string} globalName
	 * @param {(function|object|null)} optionsOrExtend
	 * @param {object} [prototypeProperties]
	 * @param {object} [staticProperties]
	 * @returns {object}
	 */
	parseFormat: function (globalName, optionsOrExtend, prototypeProperties, staticProperties) {
		var params = {
			nameObject: this._parseFullName(globalName),
			parentNameObject: null,
			parentClass: null,
			prototypeProperties: null,
			staticProperties: null,
			format: null,
			mixes: []
		};

		// Joints v0.2 (old) format
		if (optionsOrExtend === null || typeof optionsOrExtend === 'function') {
			params.parentClass = optionsOrExtend;
			params.prototypeProperties = prototypeProperties;
			params.staticProperties = staticProperties;
			params.format = FORMAT_JOINTS_V02;

			if (params.parentClass && typeof params.parentClass.debugClassName === 'string') {
				params.parentNameObject = this._parseFullName(params.parentClass.debugClassName);
			}

			// Joints v1.0 format
		} else if (typeof optionsOrExtend === 'object') {
			if (optionsOrExtend.hasOwnProperty('__extends')) {
				params.parentClass = optionsOrExtend.__extends;
				delete optionsOrExtend.__extends;
			}

			if (optionsOrExtend.hasOwnProperty('__static')) {
				params.staticProperties = optionsOrExtend.__static;
				delete optionsOrExtend.__static;
			}

			if (optionsOrExtend.hasOwnProperty('__mixes')) {
				params.mixes = [].concat[optionsOrExtend.__mixes];
				delete optionsOrExtend.__mixes;
			}

			params.format = FORMAT_JOINTS_V10;
			params.prototypeProperties = optionsOrExtend;

			if (params.parentClass && typeof params.parentClass.__className === 'string') {
				params.parentNameObject = this._parseFullName(params.parentClass.__className);
			}
		}

		return params;
	},

	applyClassConfig: function(newClass, params) {
		var classNameKey = params.format === FORMAT_JOINTS_V02 ? 'debugClassName' : '__className';
		var parentClassNameKey = params.format === FORMAT_JOINTS_V02 ? '' : '__parentClassName';
		var staticNameKey = params.format === FORMAT_JOINTS_V02 ? '_static' : '__static';

		newClass[classNameKey] = newClass.prototype[classNameKey] = params.nameObject.globalName;
		if (parentClassNameKey) {
			newClass[parentClassNameKey] = newClass.prototype[parentClassNameKey] = params.parentNameObject ? (params.parentNameObject.globalName || null) : null;
		}
		newClass[staticNameKey] = newClass.prototype[staticNameKey] = newClass;

		return newClass;
	},

	_parseFullName: function(globalName) {
		// Split namespace
		var pos = globalName.lastIndexOf('.');

		return {
			globalName: globalName,
			name: pos !== -1 ? globalName.substr(pos + 1) : globalName,
			namespace: pos !== -1 ? globalName.substr(0, pos) : ''
		};
	}

};
