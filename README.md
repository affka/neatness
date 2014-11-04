Neatness
======

Neatness - Full-Stack library for implementation OOP-style classes in JavaScript.

```js
Neatness.defineClass('MyClass', {
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
Namespace in Neatness - is normal object, you can access to namespace items
via simple navigation `my.namespace` or via `Neatness.namespace('my.namespace')` method:
```js
Neatness.defineClass('my.namespace.MyClass', {
    name: 'Ivan'
});

var namespace = Neatness.namespace('my.namespace');
var myClass = new my.namespace.MyClass();
```

### Simple extends
Neatness supported simple (not multi) extends prototype and static properties and methods.
```js
var Neatness = require('neatness');
var app = Neatness.namespace('app');

Neatness.defineClass('app.models.User', {
	__extends: Neatness.Object,
	role: 'user',
	name: null,

	constructor: function(name) {
        this.name = name;
	},
	getRole: function() {

	}
});
Neatness.defineClass('app.models.Operator', {
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
Neatness.defineClass('app.models.Article', {
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
Neatness.defineClass('app.models.ViewMixin', {
	getCategories: function() {
	    return this.categories.join(', ');
	}
});
Neatness.defineClass('app.models.Article', {
    __mixin: app.models.ViewMixin,
	categories: ['news', 'other']
});

var article = new app.models.Article();
console.log(article.getCategories()); // 'news, other'
```

### Static properties and methods
```js
Neatness.defineClass('app.models.Category', {
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
Neatness.defineClass('app.Base', {
	getText: function(name) {
	    return 'Hello, ' + name + '.';
	}
});
Neatness.defineClass('app.HelloWorld', {
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
### Neatness.defineClass(className, options)
- `className` Full defined class name with namespace.
- `options` Object with prototype properties and methods.
- `options.__extends` Link to class or string class name of extends class.
- `options.__mixin` Link to class or string class name of attached mixin.
- `options.__mixins` Link to class or string class name of attached mixins.
- `options.__static` Object with static properties and methods.
- Method returns current class

### Neatness.defineEnum(className, options)
- `className` Full defined enum name with namespace.
- `options` Key-value object.
- Method returns current enum

```js
Neatness.defineEnum('app.AnswersEnum', {
	YES: 'yes',
	NO: 'no'
});

console.log(app.AnswerEnum.YES); // yes
```

### Neatness.namespace(path)
- `path` String of full namespace path
- Method returns object of specified namespace

### Neatness.newContext(removeGlobal)
- `removeGlobal` Boolean flag, set true for remove Neatness object from window (browser global object)
- Method returns new Neatness instance with new context. See section "Usage for libraries".

### Access to class names
All classes, which defined through Neatness.defineClass() have next static and prototype properties:
- `__className` Full current class name with namespace. Example: `app.MyClass`
- `__instanceName` Unique instance name. Example: `app.MyClass864`
- `__parentClassName` Full parent (extends) class name with namespace. Example: `app.MyBaseClass`
- `__static` Link to used class. If you access to this property in extends classes, then you give top-level class. Example:

```js
Neatness.defineClass('app.BaseClass', {
	isMy: function() {
		return this.__static === app.MyClass;
	}
});
Neatness.defineClass('app.MyClass', {
	__extends: app.BaseClass
});

console.log((new app.BaseClass()).isMy()); // false
console.log((new app.MyClass()).isMy()); // true
```

### Neatness.Object

Base class for any you class. This class has not implementation and need for improvement navigation in IDE.
Prototype methods:
- `className()` Returns full class name with namespace
- `classInstanceName()` Returns unique instance name
- `parentClassName()` Returns full parent class name with namespace

### Neatness.Exception
Base class for you exceptions. This class extended from native JavaScript Error function and detect true stacktrace and error name.

----------------------------

Usage in Node.js
---

File `main.js`

```js
var Neatness = require('neatness');
var app = Neatness.namespace('app');
```


File `app/MyClass.js`

```js
var Neatness = require('neatness');

Neatness.defineClass('app.MyClass', {
	__extends: 'app.BaseClass'
});
```

----------------------------

Usage for libraries
---

```js
(function() {
    // Included Neatness source code or Neatness in globally

    // Create new context, set `true` flag for remove Neatness
    // object from window (browser global object)
    var Neatness = Neatness.newContext(true);

    // Create namespace, which saved in created Neatness context
    var app = Neatness.namespace('app');

    // You library code
    Neatness.defineClass('app.MyClass', {
    });
})();
```

----------------------------

Full class define example with jsdoc example
---

```js
Neatness.defineClass('app.BaseUser', /** @lends app.BaseUser.prototype */{
    __extends: Neatness.Object,
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
     * @extends Neatness.Object
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
Neatness.defineClass('app.MyUser', /** @lends app.MyUser.prototype */{
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