var Joints = require('../../index');

exports.defineTest = function(test) {
	// Init namespace
	var tests = Joints.namespace('tests');
	test.strictEqual(typeof tests, 'object');

	// Define class
	var MyDefinedClass = Joints.defineClass('tests.unit.MyDefinedClass', {
	});

	test.strictEqual(typeof tests.unit.MyDefinedClass, 'function');
	test.strictEqual(MyDefinedClass, tests.unit.MyDefinedClass);

	var myClass = new tests.unit.MyDefinedClass();
	test.strictEqual(myClass instanceof tests.unit.MyDefinedClass, true);
	test.strictEqual(myClass.__static, tests.unit.MyDefinedClass);

	test.done();
};

exports.extendsTest = function(test) {
	var tests = Joints.namespace('tests');

	// Define classes
	Joints.defineClass('tests.BaseClass', {
		__extends: Joints.Object,
		__static: {
			staticParamString: 'str1',
			staticParamNumber: 10,
			staticParamExtendedObject: {
				prop: 'val',
				obj: {
					num: 1
				}
			},
			staticParamObject: {
				position: 50
			},
			staticParamExtendedArray: ['qwe', [1], 50],
			staticParamArray: ['rr', 'aa', 'oo'],
			staticFunc: function() {
				return 3;
			}
		},
		paramString: 'str1',
		paramNumber: 10,
		paramExtendedObject: {
			prop: 'val',
			obj: {
				num: 1
			}
		},
		paramObject: {
			position: 50
		},
		paramExtendedArray: ['qwe', [1], 50],
		paramArray: ['rr', 'aa', 'oo'],
		paramForConstructor: null,
		constructor: function() {
			this.paramForConstructor = 10;
		},
		func: function() {
			return 5;
		}
	});
	Joints.defineClass('tests.MyFirstClass', {
		__extends: tests.BaseClass,
		__static: {
			staticParamString: 'myStr1',
			staticParamNumber: 50,
			staticParamExtendedObject: {
				prop: 'val2'
			},
			staticParamExtendedArray: ['zxc', 90],
			staticFunc: function() {
				return this.__super() + 8;
			}
		},
		paramString: 'myStr1',
		paramNumber: 50,
		paramExtendedObject: {
			prop: 'val2'
		},
		paramExtendedArray: ['zxc', 90],
		constructor: function() {
			this.__super();
			this.paramForConstructor++;
		},
		func: function() {
			return this.__super() + 33;
		}
	});

	var base = new tests.BaseClass();
	var myFirst = new tests.MyFirstClass();
	test.strictEqual(base instanceof tests.BaseClass, true);
	test.strictEqual(base instanceof tests.MyFirstClass, false);
	test.strictEqual(myFirst instanceof tests.BaseClass, true);
	test.strictEqual(myFirst instanceof tests.MyFirstClass, true);

	// Extend string
	test.strictEqual(base.paramString, 'str1');
	test.strictEqual(myFirst.paramString, 'myStr1');

	// Extend static string
	test.strictEqual(tests.BaseClass.staticParamString, 'str1');
	test.strictEqual(tests.MyFirstClass.staticParamString, 'myStr1');

	// Extend number
	test.strictEqual(base.paramNumber, 10);
	test.strictEqual(myFirst.paramNumber, 50);

	// Extend static number
	test.strictEqual(tests.BaseClass.staticParamNumber, 10);
	test.strictEqual(tests.MyFirstClass.staticParamNumber, 50);

	// Extend object with replace
	test.strictEqual(base.paramExtendedObject.prop, 'val');
	test.strictEqual(myFirst.paramExtendedObject.prop, 'val2');
	test.strictEqual(base.paramExtendedObject.obj.num, 1);
	test.strictEqual(myFirst.paramExtendedObject.obj, undefined);
	test.notStrictEqual(base.paramExtendedObject, myFirst.paramExtendedObject);
	test.notStrictEqual(base.paramExtendedObject.obj, myFirst.paramExtendedObject.obj);

	// Extend static object with replace
	test.strictEqual(tests.BaseClass.staticParamExtendedObject.prop, 'val');
	test.strictEqual(tests.MyFirstClass.staticParamExtendedObject.prop, 'val2');
	test.strictEqual(tests.BaseClass.staticParamExtendedObject.obj.num, 1);
	test.strictEqual(tests.MyFirstClass.staticParamExtendedObject.obj, undefined);
	test.notStrictEqual(tests.BaseClass.staticParamExtendedObject, tests.MyFirstClass.staticParamExtendedObject);
	test.notStrictEqual(tests.BaseClass.staticParamExtendedObject.obj, tests.MyFirstClass.staticParamExtendedObject.obj);

	// Extend object
	test.strictEqual(base.paramObject.position, 50);
	test.strictEqual(myFirst.paramObject.position, 50);
	test.notStrictEqual(base.paramObject, myFirst.paramObject);

	// Extend static object, static array and objects is not cloned
	test.strictEqual(tests.BaseClass.staticParamObject.position, 50);
	test.strictEqual(tests.MyFirstClass.staticParamObject.position, 50);
	test.strictEqual(tests.BaseClass.staticParamObject, tests.MyFirstClass.staticParamObject);

	// Extend array with replace
	test.strictEqual(base.paramExtendedArray[0], 'qwe');
	test.strictEqual(myFirst.paramExtendedArray[0], 'zxc');
	test.strictEqual(base.paramExtendedArray[1][0], 1);
	test.strictEqual(base.paramExtendedArray[2], 50);
	test.strictEqual(myFirst.paramExtendedArray[2], undefined);
	test.notStrictEqual(base.paramExtendedArray, myFirst.paramExtendedArray);
	test.notStrictEqual(base.paramExtendedArray[1], myFirst.paramExtendedArray[1]);

	// Extend static array with replace
	test.strictEqual(tests.BaseClass.staticParamExtendedArray[0], 'qwe');
	test.strictEqual(tests.MyFirstClass.staticParamExtendedArray[0], 'zxc');
	test.strictEqual(tests.BaseClass.staticParamExtendedArray[1][0], 1);
	test.strictEqual(tests.BaseClass.staticParamExtendedArray[2], 50);
	test.strictEqual(tests.MyFirstClass.staticParamExtendedArray[2], undefined);
	test.notStrictEqual(tests.BaseClass.staticParamExtendedArray, tests.MyFirstClass.staticParamExtendedArray);
	test.notStrictEqual(tests.BaseClass.staticParamExtendedArray[1], tests.MyFirstClass.staticParamExtendedArray[1]);

	// Extend array
	test.strictEqual(base.paramArray[1], 'aa');
	test.strictEqual(myFirst.paramArray[1], 'aa');
	test.notStrictEqual(base.paramArray, myFirst.paramArray);
	base.paramArray = base.paramArray.sort();
	test.strictEqual(base.paramArray.toString(), 'aa,oo,rr');
	test.strictEqual(myFirst.paramArray.toString(), 'rr,aa,oo');

	// Extend static array, static array and objects is not cloned
	test.strictEqual(tests.BaseClass.staticParamArray[1], 'aa');
	test.strictEqual(tests.MyFirstClass.staticParamArray[1], 'aa');
	test.strictEqual(tests.BaseClass.staticParamArray, tests.MyFirstClass.staticParamArray);
	tests.BaseClass.staticParamArray = tests.BaseClass.staticParamArray.sort();
	test.strictEqual(tests.BaseClass.staticParamArray.toString(), 'aa,oo,rr');
	test.strictEqual(tests.MyFirstClass.staticParamArray.toString(), 'aa,oo,rr');

	// Extend constructor
	test.strictEqual(base.paramForConstructor, 10);
	test.strictEqual(myFirst.paramForConstructor, 11);

	// Extend prototype method
	test.strictEqual(base.func(), 5);
	test.strictEqual(myFirst.func(), 38);

	// Extend static method
	test.strictEqual(tests.BaseClass.staticFunc(), 3);
	test.strictEqual(tests.MyFirstClass.staticFunc(), 11);

	test.done();
};

exports.formatsTest = function(test) {
	var tests = Joints.namespace('tests');

	// v0.2 format
	Joints.defineClass('tests.BaseFormat02Class', null, {
		protoParam1: 'proto1'
	}, {
		staticParam1: 'static1'
	});
	Joints.defineClass('tests.MyFormat02Class', tests.BaseFormat02Class, {
		protoParam2: 'proto2'
	}, {
		staticParam2: 'static2'
	});

	var base = new tests.BaseFormat02Class();
	var myFirst = new tests.MyFormat02Class();
	test.strictEqual(base.__className, 'tests.BaseFormat02Class');
	test.strictEqual(base.debugClassName, 'tests.BaseFormat02Class');
	test.strictEqual(base.protoParam1, 'proto1');
	test.strictEqual(base.protoParam2, undefined);
	test.strictEqual(myFirst.__className, 'tests.MyFormat02Class');
	test.strictEqual(myFirst.debugClassName, 'tests.MyFormat02Class');
	test.strictEqual(myFirst.protoParam1, 'proto1');
	test.strictEqual(myFirst.protoParam2, 'proto2');
	test.strictEqual(tests.BaseFormat02Class.staticParam1, 'static1');
	test.strictEqual(tests.BaseFormat02Class.staticParam2, undefined);
	test.strictEqual(tests.MyFormat02Class.staticParam1, 'static1');
	test.strictEqual(tests.MyFormat02Class.staticParam2, 'static2');

	// Names
	test.strictEqual(base.debugClassName, 'tests.BaseFormat02Class');
	test.strictEqual(myFirst.debugClassName, 'tests.MyFormat02Class');

	// v1.0 format
	Joints.defineClass('tests.name.FirstClass', {
		__extends: Joints.Object
	});
	Joints.defineClass('tests.name.SecondClass', {
		__extends: tests.name.FirstClass
	});

	var first = new tests.name.FirstClass();
	var second = new tests.name.SecondClass();

	// Names
	test.strictEqual(first.__className, 'tests.name.FirstClass');
	test.strictEqual(first.className(), 'tests.name.FirstClass');
	test.strictEqual(second.__className, 'tests.name.SecondClass');
	test.strictEqual(second.className(), 'tests.name.SecondClass');
	test.strictEqual(second.__parentClassName, 'tests.name.FirstClass');
	test.strictEqual(second.parentClassName(), 'tests.name.FirstClass');

	// Backbone format
	// @todo

	test.done();
};

exports.baseObjectTest = function(test) {
	var tests = Joints.namespace('tests');

	// v1.0 format
	Joints.defineClass('tests.MyObject', {
		__extends: Joints.Object
	});

	var myObject = new tests.MyObject();
	test.strictEqual(myObject instanceof Joints.Object, true);

	test.done();
};

exports.mixinsTest = function(test) {
	var tests = Joints.namespace('tests');

	Joints.defineClass('tests.MyMixin', {
		__static: {
			staticMixinProp: 10,
			staticMixinGet: function() {
				return 20;
			}
		},
		mixinProp: 30,
		mixinGet: function() {
			return 40;
		}
	});

	// by __mixin property
	Joints.defineClass('tests.MyMixObject1', {
		__mixins: tests.MyMixin
	});

	var myMixObject1 = new tests.MyMixObject1();
	test.strictEqual(tests.MyMixObject1.staticMixinProp, 10);
	test.strictEqual(tests.MyMixObject1.staticMixinGet(), 20);
	test.strictEqual(myMixObject1.mixinProp, 30);
	test.strictEqual(myMixObject1.mixinGet(), 40);

	test.done();
};

exports.multipleMixinsTest = function(test) {
	var tests = Joints.namespace('tests');

	Joints.defineClass('tests.Mixin1', {
		__static: {
			staticMixinProp: 10,
			staticMixinGet: function() {
				return 20;
			}
		},
		mixinProp: 30,
		mixinGet: function() {
			return 40;
		}
	});
	Joints.defineClass('tests.Mixin2', {
		__static: {
			staticMixin2Prop: 'aa',
			staticMixin2Get: function() {
				return 'bb';
			}
		},
		mixin2Prop: 'cc',
		mixin2Get: function() {
			return 'dd';
		}
	});

	Joints.defineClass('tests.MultiMixObject', {
		__mixins: [
			tests.Mixin1,
			tests.Mixin2
		]
	});

	var multiMixObject = new tests.MultiMixObject();
	test.strictEqual(tests.MultiMixObject.staticMixinProp, 10);
	test.strictEqual(tests.MultiMixObject.staticMixinGet(), 20);
	test.strictEqual(multiMixObject.mixinProp, 30);
	test.strictEqual(multiMixObject.mixinGet(), 40);
	test.strictEqual(tests.MultiMixObject.staticMixin2Prop, 'aa');
	test.strictEqual(tests.MultiMixObject.staticMixin2Get(), 'bb');
	test.strictEqual(multiMixObject.mixin2Prop, 'cc');
	test.strictEqual(multiMixObject.mixin2Get(), 'dd');

	test.done();
};

exports.mixinReplacePropertyExceptionTest = function(test) {
	var tests = Joints.namespace('tests');

	Joints.defineClass('tests.MyMixinReplace', {
		__static: {
			staticMixinProp: 10,
			staticMixinGet: function() {
				return 20;
			}
		},
		mixinProp: 30,
		mixinGet: function() {
			return 40;
		}
	});

	// Try replace property
	test.throws(function() {
		Joints.defineClass('tests.MyMixReplaceObject', {
			__mixin: tests.MyMixinReplace,
			mixinProp: 30
		});
	});

	// Try replace method
	test.throws(function() {
		Joints.defineClass('tests.MyMixReplaceObject', {
			__mixin: tests.MyMixinReplace,
			mixinGet: function() {}
		});
	});

	// Try replace static property
	test.throws(function() {
		Joints.defineClass('tests.MyMixReplaceObject', {
			__mixin: tests.MyMixinReplace,
			__static: {
				staticMixinProp: 30
			}
		});
	});

	// Try replace static method
	test.throws(function() {
		Joints.defineClass('tests.MyMixReplaceObject', {
			__mixin: tests.MyMixinReplace,
			__static: {
				staticMixinGet: function () {}
			}
		});
	});

	test.done();
};

exports.newContextTest = function(test) {
	var t1 = Joints.namespace('t1');
	Joints.defineClass('t1.MyClassInGlobalContext', {});

	var MyJoints = Joints.newContext();
	var t2 = MyJoints.namespace('t2');
	MyJoints.defineClass('t2.MyClassInMyContext', {});

	test.strictEqual(typeof t1.MyClassInGlobalContext, 'function');
	test.strictEqual(typeof t2.MyClassInGlobalContext, 'undefined');
	test.strictEqual(typeof t1.MyClassInMyContext, 'undefined');
	test.strictEqual(typeof t2.MyClassInMyContext, 'function');

	test.done();
};

exports.instanceNameTest = function(test) {
	// Init namespace
	var tests = Joints.namespace('tests');

	// Define class
	Joints.defineClass('tests.unit.InstTestClass', {});

	var instTestClass = new tests.unit.InstTestClass();
	test.strictEqual(/^tests\.unit\.InstTestClass[0-9]+$/.test(instTestClass.__instanceName), true);

	test.done();
};

exports.defineEnumTest = function(test) {
	// Init namespace
	var tests = Joints.namespace('tests');

	// Define class
	Joints.defineEnum('tests.unit.EnumTestClass', {
		TEST: 'test'
	});

	test.strictEqual(tests.unit.EnumTestClass.TEST, 'test');

	test.done();
};

exports.stringExtendAndMixinClassName = function(test) {
	// Init namespace
	var tests = Joints.namespace('tests');

	// Define class
	Joints.defineClass('tests.strings.TestMixin1', {
		MIX1: 1
	});
	Joints.defineClass('tests.strings.TestMixin2', {
		MIX2: 2
	});
	Joints.defineClass('tests.strings.BaseClass', {
		name: 'test'
	});
	Joints.defineClass('tests.strings.TestClass', {
		__extends: 'tests.strings.BaseClass',
		__mixins: [
			'tests.strings.TestMixin1',
			tests.strings.TestMixin2
		]
	});

	var testClass = new tests.strings.TestClass();
	test.strictEqual(testClass.MIX1, 1);
	test.strictEqual(testClass.MIX2, 2);
	test.strictEqual(testClass.name, 'test');

	test.done();
};


exports.staticLinkTest = function(test) {
	// Init namespace
	var tests = Joints.namespace('tests');

	Joints.defineClass('tests.SLBaseClass', {
		isMy: function() {
			return this.__static === tests.SLMyClass;
		}
	});
	Joints.defineClass('tests.SLMyClass', {
		__extends: tests.SLBaseClass
	});

	test.strictEqual((new tests.SLBaseClass()).isMy(), false);
	test.strictEqual((new tests.SLMyClass()).isMy(), true);

	test.done();
};
