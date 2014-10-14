
module.exports = function(Joints) {

	/**
	 * Base class. Extend all you base classes from this class for true navigation in IDE
	 * and support methods such as {@link Joints.Object#className}
	 * @class Joints.Object
	 */
	return Joints.createClass('Joints.Object', {

		/**
		 * Full current class name with namespace
		 * @example
		 *  app.MyClass
		 * @type {string}
		 * @protected
		 */
		__className: null,

		/**
		 * Full parent (extends) class name with namespace
		 * @example
		 *  app.MyBaseClass
		 * @type {string}
		 * @protected
		 */
		__parentClassName: null,

		/**
		 * Returns full class name with namespace
		 * @example
		 *  app.MyClass
		 * @returns {string}
		 */
		className: function() {
			return this.__className;
		},

		/**
		 * Returns full parent class name with namespace
		 * @example
		 *  app.MyBaseClass
		 * @returns {string}
		 */
		parentClassName: function() {
			return this.__parentClassName;
		},

		/**
		 * Call parent class methods through this method. This method support only synchronous nested calls.
		 * @param {...*}
		 * @protected
		 */
		__super: function () {
		}

	});

};
