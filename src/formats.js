var FORMAT_JOINTS_V02 = 'joints_v02';
var FORMAT_JOINTS_V10 = 'joints_v10';

module.exports = {

	/**
	 * Detect format and return class params
	 * @param {string} globalName
	 * @param {(function|object|null)} optionsOrExtend
	 * @param {object} [protoProps]
	 * @param {object} [staticProps]
	 * @returns {object}
	 */
	parseFormat: function (globalName, optionsOrExtend, protoProps, staticProps) {
		var nameObject = this.parseFullName(globalName);
		var parentNameObject = null;
		var parentClass = null;
		var prototypeProperties = null;
		var staticProperties = null;
		var format = null;
		var mixins = [];

		// Joints v0.2 (old) format
		if (optionsOrExtend === null || typeof optionsOrExtend === 'function') {
			parentClass = optionsOrExtend;
			prototypeProperties = protoProps;
			staticProperties = staticProps;
			format = FORMAT_JOINTS_V02;

			if (parentClass && typeof parentClass.debugClassName === 'string') {
				parentNameObject = this.parseFullName(parentClass.debugClassName);
			}

			// Joints v1.0 format
		} else if (typeof optionsOrExtend === 'object') {
			if (optionsOrExtend.hasOwnProperty('__extends')) {
				parentClass = optionsOrExtend.__extends;
				delete optionsOrExtend.__extends;
			}

			if (optionsOrExtend.hasOwnProperty('__static')) {
				staticProperties = optionsOrExtend.__static;
				delete optionsOrExtend.__static;
			}

			if (optionsOrExtend.hasOwnProperty('__mixins')) {
				mixins = mixins.concat(optionsOrExtend.__mixins);
				delete optionsOrExtend.__mixins;
			}
			if (optionsOrExtend.hasOwnProperty('__mixin')) {
				mixins = mixins.concat(optionsOrExtend.__mixin);
				delete optionsOrExtend.__mixin;
			}

			format = FORMAT_JOINTS_V10;
			prototypeProperties = optionsOrExtend;

			if (parentClass && typeof parentClass.__className === 'string') {
				parentNameObject = this.parseFullName(parentClass.__className);
			}
		}

		return [
			nameObject,
			parentNameObject,
			parentClass,
			prototypeProperties,
			staticProperties,
			format,
			mixins
		];
	},

	applyClassConfig: function(newClass, format, nameObject, parentNameObject) {
		var classNameKey = format === FORMAT_JOINTS_V02 ? 'debugClassName' : '__className';
		var parentClassNameKey = format === FORMAT_JOINTS_V02 ? '' : '__parentClassName';
		var staticNameKey = format === FORMAT_JOINTS_V02 ? '_static' : '__static';

		newClass[classNameKey] = newClass.prototype[classNameKey] = nameObject.globalName;
		if (parentClassNameKey) {
			newClass[parentClassNameKey] = newClass.prototype[parentClassNameKey] = parentNameObject ? (parentNameObject.globalName || null) : null;
		}
		newClass[staticNameKey] = newClass.prototype[staticNameKey] = newClass;

		return newClass;
	},

	parseFullName: function(globalName) {
		// Split namespace
		var pos = globalName.lastIndexOf('.');

		return {
			globalName: globalName,
			name: pos !== -1 ? globalName.substr(pos + 1) : globalName,
			namespace: pos !== -1 ? globalName.substr(0, pos) : ''
		};
	}

};
