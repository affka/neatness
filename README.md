Joints
======

Joints - Full-Stack library for implementation OOP-style classes in JavaScript.

```js
Joints.defineClass('MyClass', {
    name: 'Ivan'
});

var myClass = new MyClass();
console.log(myClass.name); // Ivan
```

----------------------------

Supported features
---

### Namespaces
Set full class name (with namespace) for auto create namespace hierarchy.
Namespace in Joints - is normal object, you can access to namespace items
via simple navigation `my.namespace` or via `Joints.namespace('my.namespace')` method:
```js
Joints.defineClass('my.namespace.MyClass', {
    name: 'Ivan'
});

var namespace = Joints.namespace('my.namespace');
var myClass = new my.namespace.MyClass();
```

### Simple extends
Joints supported simple (not multi) extends prototype and static properties and methods.
```js
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
console.log(user.name); // John

var user = new app.models.Operator('Sebastian');
console.log(user.role); // operator
```

### Usage objects and arrays in class properties
All objects and arrays in prototypes will be cloned in inherited objects. But in static - do not.
```js
Joints.defineClass('app.models.Article', {
	categories: ['news', 'other']
});
var article1 = new app.models.Article();
var article2 = new app.models.Article();
article1.categories.push('fun');
console.log(article2.categories); // ['news', 'other']
```

### Mixins
Mixin - is a class without constructor. This structure have only prototype and static methods and properties.
**Important!** Mixin can only add method and properties, by not overwrite. If you class and used mixin have duplicate methods or properties, will be throws exceptions.

```js
Joints.defineClass('app.models.ViewMixin', {
	getCategories: function() {
	    return this.categories.join(', ');
	}
});
Joints.defineClass('app.models.Article', {
    __mixin: app.models.ViewMixin,
	categories: ['news', 'other']
});

var article = new app.models.Article();
console.log(article.getCategories()); // 'news, other'
```

### Static properties and methods
```js
Joints.defineClass('app.models.Category', {
    __static: {
	    TYPE_FUN: 'fun',
		getAllTypes: function() {
		    return [ this.TYPE_FUN ];
		}
    }
});

console.log(app.models.Category.getAllTypes()); // ['fun']
```

### Easy call parent method via this.__super()
All methods in class have can call `__super()` method for call parent. **Notice:** You can use this call only for synchronous operations!
```js
Joints.defineClass('app.Base', {
	getText: function(name) {
	    return 'Hello, ' + name + '.';
	}
});
Joints.defineClass('app.HelloWorld', {
    __extends: app.Base,
	getText: function(name) {
	    return this.__super(name) + ' Good luck!';
	}
});

var helloWorld = new app.HelloWorld();
console.log(helloWorld.getText('John')); // 'Hello, John. Good luck!'
```

----------------------------

Documentation
---
### Joints.defineClass(className, options)
- `className` Full defined class name with namespace.
- `options` Object with prototype properties and methods.
- `options.__extends` Link to class or string class name of extends class.
- `options.__mixin` Link to class or string class name of attached mixin.
- `options.__mixins` Link to class or string class name of attached mixins.
- `options.__static` Object with static properties and methods.
- Method returns current class

### Joints.defineEnum(className, options)
- `className` Full defined enum name with namespace.
- `options` Key-value object.
- Method returns current enum

```js
Joints.defineEnum('app.AnswersEnum', {
	YES: 'yes',
	NO: 'no'
});

console.log(app.AnswerEnum.YES); // yes
```

### Joints.namespace(path)
- `path` String of full namespace path
- Method returns object of specified namespace

### Joints.newContext(removeGlobal)
- `removeGlobal` Boolean flag, set true for remove Joints object from window (browser global object)
- Method returns new Joints instance with new context. See section "Usage for libraries".

### Access to class names
All classes, which defined through Joints.defineClass() have next static and prototype properties:
- `__className` Full current class name with namespace. Example: `app.MyClass`
- `__instanceName` Unique instance name. Example: `app.MyClass864`
- `__parentClassName` Full parent (extends) class name with namespace. Example: `app.MyBaseClass`
- `__static` Link to used class. If you access to this property in extends classes, then you give top-level class. Example:

```js
Joints.defineClass('app.BaseClass', {
	isMy: function() {
		return this.__static === app.MyClass;
	}
});
Joints.defineClass('app.MyClass', {
	__extends: app.BaseClass
});

console.log((new app.BaseClass()).isMy()); // false
console.log((new app.MyClass()).isMy()); // true
```

### Joints.Object

Base class for any you class. This class has not implementation and need for improvement navigation in IDE.
Prototype methods:
- `className()` Returns full class name with namespace
- `classInstanceName()` Returns unique instance name
- `parentClassName()` Returns full parent class name with namespace

### Joints.Exception
Base class for you exceptions. This class extended from native JavaScript Error function and detect true stacktrace and error name.

----------------------------

Usage in Node.js
---

File `main.js`

```js
var Joints = require('joints');
var app = Joints.namespace('app');
```


File `app/MyClass.js`

```js
var Joints = require('joints');

Joints.defineClass('app.MyClass', {
	__extends: 'app.BaseClass'
});
```

----------------------------

Usage for libraries
---

```js
(function() {
    // Included Joints source code or Joints in globally

    // Create new context, set `true` flag for remove Joints
    // object from window (browser global object)
    var Joints = Joints.newContext(true);

    // Create namespace, which saved in created Joints context
    var app = Joints.namespace('app');

    // You library code
    Joints.defineClass('app.MyClass', {
    });
})();
```

----------------------------

Full class define example with jsdoc example
---

```js
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
```

----------------------------

Unit tests
---

All library coverage in node unit tests. You can run it's by:

```sh
nodeunit tests/unit
```