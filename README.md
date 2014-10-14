Joints
======

Joints - Full-Stack library for implementation OOP-style classes in JavaScript.


Supported features
---

  - Namespaces
  - Simple extends
  - Mixins
  - Static properties and methods
  - Usage objects as class properties with true extends
  - Easy call parent method via this.__super()

Basic classes (bonus)
---

  - Joints.Object - base class for any you class. This class has not implementation and need for improvement navigation in IDE.
  - Joints.Exception - base class for you exceptions. This class extended from native JavaScript Error function and detect true stacktrace and error name.

Simple example
---

    var Joints = require('joints');
    var app = Joints.namespace('app');

	Joints.defineClass('app.models.User', {
		__extends: Joints.Object,
		role: 'user',
		name: null,

		constructor: function(name) {
            this.name = name;
		},
		getRole: function() {

		}
	});
	Joints.defineClass('app.models.Operator', {
		__extends: app.models.User,
		role: 'operator'
	});

	var user = new app.models.User('John');
	console.log(user.role); // user
	console.log(user.name); // user

	var user = new app.models.Operator('Sebastian');
	console.log(user.role); // operator

Usage in Node.js
---

File `main.js`

    var Joints = require('joints');
    var app = Joints.namespace('app');

File `app/MyClass.js`

    var Joints = require('joints');

	Joints.defineClass('app.MyClass', {
	});

Usage for libraries
---

    (function() {
        // Included Joints source code or Joints in globally

        // Create new context, set `true` flag for remove Joints object from window (browser global object)
        var Joints = Joints.newContext(true);

        // Create namespace, which saved in created Joints context
        var app = Joints.namespace('app');

        // You library code
        Joints.defineClass('app.MyClass', {
        });
    })();

Full class define example
---

    Joints.defineClass('app.BaseUser', /** @lends app.BaseUser.prototype */{
        __extends: Joints.Object,
        __static: /** @lends app.BaseUser */{
            /**
             * @type {string}
             */
            text: 'my text',

            /**
             * @type {Array.<string|number>}
             */
            customList: ['zero', 1, 50],

            /**
             * @returns {number}
             */
            getNumber: function() {
                return 3;
            }
        },

        /**
         * @type {string}
         */
        _name: null,

        /**
         * @type {object}
         */
        roleLabels: {
            user: 'User',
            operator: 'Operator'
        },

        /**
         * @param {string} name User name
         * @constructs
         * @extends Joints.Object
         */
        constructor: function(name) {
            this._name = name;
            this.__super(name);
        }
    });

    /**
     * @class app.MyUser
     * @extends app.BaseUser
     */
    Joints.defineClass('app.MyUser', /** @lends app.MyUser.prototype */{
        __extends: tests.BaseClass,

        /**
         * @returns {null|string}
         */
        getName: function() {
            return this._name;
        }
    });