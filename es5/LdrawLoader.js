"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
(function () {
  // Special surface finish tag types.
  // Note: "MATERIAL" tag (e.g. GLITTER, SPECKLE) is not implemented
  var FINISH_TYPE_DEFAULT = 0;
  var FINISH_TYPE_CHROME = 1;
  var FINISH_TYPE_PEARLESCENT = 2;
  var FINISH_TYPE_RUBBER = 3;
  var FINISH_TYPE_MATTE_METALLIC = 4;
  var FINISH_TYPE_METAL = 5;

  // State machine to search a subobject path.
  // The LDraw standard establishes these various possible subfolders.
  var FILE_LOCATION_TRY_PARTS = 0;
  var FILE_LOCATION_TRY_P = 1;
  var FILE_LOCATION_TRY_MODELS = 2;
  var FILE_LOCATION_AS_IS = 3;
  var FILE_LOCATION_TRY_RELATIVE = 4;
  var FILE_LOCATION_TRY_ABSOLUTE = 5;
  var FILE_LOCATION_NOT_FOUND = 6;
  var MAIN_COLOUR_CODE = '16';
  var MAIN_EDGE_COLOUR_CODE = '24';
  var _tempVec0 = new THREE.Vector3();
  var _tempVec1 = new THREE.Vector3();
  var LDrawConditionalLineMaterial = /*#__PURE__*/function (_THREE$ShaderMaterial) {
    _inherits(LDrawConditionalLineMaterial, _THREE$ShaderMaterial);
    var _super = _createSuper(LDrawConditionalLineMaterial);
    function LDrawConditionalLineMaterial(parameters) {
      var _this;
      _classCallCheck(this, LDrawConditionalLineMaterial);
      _this = _super.call(this, {
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
          diffuse: {
            value: new THREE.Color()
          },
          opacity: {
            value: 1.0
          }
        }]),
        vertexShader: /* glsl */"\n\t\t\t\tattribute vec3 control0;\n\t\t\t\tattribute vec3 control1;\n\t\t\t\tattribute vec3 direction;\n\t\t\t\tvarying float discardFlag;\n\n\t\t\t\t#include <common>\n\t\t\t\t#include <color_pars_vertex>\n\t\t\t\t#include <fog_pars_vertex>\n\t\t\t\t#include <logdepthbuf_pars_vertex>\n\t\t\t\t#include <clipping_planes_pars_vertex>\n\t\t\t\tvoid main() {\n\t\t\t\t\t#include <color_vertex>\n\n\t\t\t\t\tvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t\tgl_Position = projectionMatrix * mvPosition;\n\n\t\t\t\t\t// Transform the line segment ends and control points into camera clip space\n\t\t\t\t\tvec4 c0 = projectionMatrix * modelViewMatrix * vec4( control0, 1.0 );\n\t\t\t\t\tvec4 c1 = projectionMatrix * modelViewMatrix * vec4( control1, 1.0 );\n\t\t\t\t\tvec4 p0 = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t\tvec4 p1 = projectionMatrix * modelViewMatrix * vec4( position + direction, 1.0 );\n\n\t\t\t\t\tc0.xy /= c0.w;\n\t\t\t\t\tc1.xy /= c1.w;\n\t\t\t\t\tp0.xy /= p0.w;\n\t\t\t\t\tp1.xy /= p1.w;\n\n\t\t\t\t\t// Get the direction of the segment and an orthogonal vector\n\t\t\t\t\tvec2 dir = p1.xy - p0.xy;\n\t\t\t\t\tvec2 norm = vec2( -dir.y, dir.x );\n\n\t\t\t\t\t// Get control point directions from the line\n\t\t\t\t\tvec2 c0dir = c0.xy - p1.xy;\n\t\t\t\t\tvec2 c1dir = c1.xy - p1.xy;\n\n\t\t\t\t\t// If the vectors to the controls points are pointed in different directions away\n\t\t\t\t\t// from the line segment then the line should not be drawn.\n\t\t\t\t\tfloat d0 = dot( normalize( norm ), normalize( c0dir ) );\n\t\t\t\t\tfloat d1 = dot( normalize( norm ), normalize( c1dir ) );\n\t\t\t\t\tdiscardFlag = float( sign( d0 ) != sign( d1 ) );\n\n\t\t\t\t\t#include <logdepthbuf_vertex>\n\t\t\t\t\t#include <clipping_planes_vertex>\n\t\t\t\t\t#include <fog_vertex>\n\t\t\t\t}\n\t\t\t",
        fragmentShader: /* glsl */"\n\t\t\tuniform vec3 diffuse;\n\t\t\tuniform float opacity;\n\t\t\tvarying float discardFlag;\n\n\t\t\t#include <common>\n\t\t\t#include <color_pars_fragment>\n\t\t\t#include <fog_pars_fragment>\n\t\t\t#include <logdepthbuf_pars_fragment>\n\t\t\t#include <clipping_planes_pars_fragment>\n\t\t\tvoid main() {\n\n\t\t\t\tif ( discardFlag > 0.5 ) discard;\n\n\t\t\t\t#include <clipping_planes_fragment>\n\t\t\t\tvec3 outgoingLight = vec3( 0.0 );\n\t\t\t\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t\t\t\t#include <logdepthbuf_fragment>\n\t\t\t\t#include <color_fragment>\n\t\t\t\toutgoingLight = diffuseColor.rgb; // simple shader\n\t\t\t\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\t\t\t\t#include <tonemapping_fragment>\n\t\t\t\t#include <encodings_fragment>\n\t\t\t\t#include <fog_fragment>\n\t\t\t\t#include <premultiplied_alpha_fragment>\n\t\t\t}\n\t\t\t"
      });
      Object.defineProperties(_assertThisInitialized(_this), {
        opacity: {
          get: function get() {
            return this.uniforms.opacity.value;
          },
          set: function set(value) {
            this.uniforms.opacity.value = value;
          }
        },
        color: {
          get: function get() {
            return this.uniforms.diffuse.value;
          }
        }
      });
      _this.setValues(parameters);
      _this.isLDrawConditionalLineMaterial = true;
      return _this;
    }
    return _createClass(LDrawConditionalLineMaterial);
  }(THREE.ShaderMaterial);
  var ConditionalLineSegments = /*#__PURE__*/function (_THREE$LineSegments) {
    _inherits(ConditionalLineSegments, _THREE$LineSegments);
    var _super2 = _createSuper(ConditionalLineSegments);
    function ConditionalLineSegments(geometry, material) {
      var _this2;
      _classCallCheck(this, ConditionalLineSegments);
      _this2 = _super2.call(this, geometry, material);
      _this2.isConditionalLine = true;
      return _this2;
    }
    return _createClass(ConditionalLineSegments);
  }(THREE.LineSegments);
  function generateFaceNormals(faces) {
    for (var i = 0, l = faces.length; i < l; i++) {
      var face = faces[i];
      var vertices = face.vertices;
      var v0 = vertices[0];
      var v1 = vertices[1];
      var v2 = vertices[2];
      _tempVec0.subVectors(v1, v0);
      _tempVec1.subVectors(v2, v1);
      face.faceNormal = new THREE.Vector3().crossVectors(_tempVec0, _tempVec1).normalize();
    }
  }
  var _ray = new THREE.Ray();
  function smoothNormals(faces, lineSegments) {
    var checkSubSegments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    // NOTE: 1e2 is pretty coarse but was chosen to quantize the resulting value because
    // it allows edges to be smoothed as expected (see minifig arms).
    // --
    // And the vector values are initialize multiplied by 1 + 1e-10 to account for floating
    // point errors on vertices along quantization boundaries. Ie after matrix multiplication
    // vertices that should be merged might be set to "1.7" and "1.6999..." meaning they won't
    // get merged. This added epsilon attempts to push these error values to the same quantized
    // value for the sake of hashing. See "AT-ST mini" dishes. See mrdoob/three#23169.

    var hashMultiplier = (1 + 1e-10) * 1e2;
    function hashVertex(v) {
      var x = ~~(v.x * hashMultiplier);
      var y = ~~(v.y * hashMultiplier);
      var z = ~~(v.z * hashMultiplier);
      return "".concat(x, ",").concat(y, ",").concat(z);
    }
    function hashEdge(v0, v1) {
      return "".concat(hashVertex(v0), "_").concat(hashVertex(v1));
    }

    // converts the two vertices to a ray with a normalized direction and origin of 0, 0, 0 projected
    // onto the original line.
    function toNormalizedRay(v0, v1, targetRay) {
      targetRay.direction.subVectors(v1, v0).normalize();
      var scalar = v0.dot(targetRay.direction);
      targetRay.origin.copy(v0).addScaledVector(targetRay.direction, -scalar);
      return targetRay;
    }
    function hashRay(ray) {
      return hashEdge(ray.origin, ray.direction);
    }
    var hardEdges = new Set();
    var hardEdgeRays = new Map();
    var halfEdgeList = {};
    var normals = [];

    // Save the list of hard edges by hash
    for (var i = 0, l = lineSegments.length; i < l; i++) {
      var ls = lineSegments[i];
      var vertices = ls.vertices;
      var v0 = vertices[0];
      var v1 = vertices[1];
      hardEdges.add(hashEdge(v0, v1));
      hardEdges.add(hashEdge(v1, v0));

      // only generate the hard edge ray map if we're checking subsegments because it's more expensive to check
      // and requires more memory.
      if (checkSubSegments) {
        // add both ray directions to the map
        var ray = toNormalizedRay(v0, v1, new THREE.Ray());
        var rh1 = hashRay(ray);
        if (!hardEdgeRays.has(rh1)) {
          toNormalizedRay(v1, v0, ray);
          var rh2 = hashRay(ray);
          var _info = {
            ray: ray,
            distances: []
          };
          hardEdgeRays.set(rh1, _info);
          hardEdgeRays.set(rh2, _info);
        }

        // store both segments ends in min, max order in the distances array to check if a face edge is a
        // subsegment later.
        var info = hardEdgeRays.get(rh1);
        var d0 = info.ray.direction.dot(v0);
        var d1 = info.ray.direction.dot(v1);
        if (d0 > d1) {
          var _ref = [d1, d0];
          d0 = _ref[0];
          d1 = _ref[1];
        }
        info.distances.push(d0, d1);
      }
    }

    // track the half edges associated with each triangle
    for (var _i = 0, _l = faces.length; _i < _l; _i++) {
      var tri = faces[_i];
      var _vertices = tri.vertices;
      var vertCount = _vertices.length;
      for (var i2 = 0; i2 < vertCount; i2++) {
        var index = i2;
        var next = (i2 + 1) % vertCount;
        var _v = _vertices[index];
        var _v2 = _vertices[next];
        var hash = hashEdge(_v, _v2);

        // don't add the triangle if the edge is supposed to be hard
        if (hardEdges.has(hash)) {
          continue;
        }

        // if checking subsegments then check to see if this edge lies on a hard edge ray and whether its within any ray bounds
        if (checkSubSegments) {
          toNormalizedRay(_v, _v2, _ray);
          var rayHash = hashRay(_ray);
          if (hardEdgeRays.has(rayHash)) {
            var _info2 = hardEdgeRays.get(rayHash);
            var _ray2 = _info2.ray,
              distances = _info2.distances;
            var _d = _ray2.direction.dot(_v);
            var _d2 = _ray2.direction.dot(_v2);
            if (_d > _d2) {
              var _ref2 = [_d2, _d];
              _d = _ref2[0];
              _d2 = _ref2[1];
            }

            // return early if the face edge is found to be a subsegment of a line edge meaning the edge will have "hard" normals
            var found = false;
            for (var _i2 = 0, _l2 = distances.length; _i2 < _l2; _i2 += 2) {
              if (_d >= distances[_i2] && _d2 <= distances[_i2 + 1]) {
                found = true;
                break;
              }
            }
            if (found) {
              continue;
            }
          }
        }
        var _info3 = {
          index: index,
          tri: tri
        };
        halfEdgeList[hash] = _info3;
      }
    }

    // Iterate until we've tried to connect all faces to share normals
    while (true) {
      // Stop if there are no more faces left
      var halfEdge = null;
      for (var key in halfEdgeList) {
        halfEdge = halfEdgeList[key];
        break;
      }
      if (halfEdge === null) {
        break;
      }

      // Exhaustively find all connected faces
      var queue = [halfEdge];
      while (queue.length > 0) {
        // initialize all vertex normals in this triangle
        var _tri = queue.pop().tri;
        var _vertices2 = _tri.vertices;
        var vertNormals = _tri.normals;
        var faceNormal = _tri.faceNormal;

        // Check if any edge is connected to another triangle edge
        var _vertCount = _vertices2.length;
        for (var _i3 = 0; _i3 < _vertCount; _i3++) {
          var _index = _i3;
          var _next = (_i3 + 1) % _vertCount;
          var _v3 = _vertices2[_index];
          var _v4 = _vertices2[_next];

          // delete this triangle from the list so it won't be found again
          var _hash = hashEdge(_v3, _v4);
          delete halfEdgeList[_hash];
          var reverseHash = hashEdge(_v4, _v3);
          var otherInfo = halfEdgeList[reverseHash];
          if (otherInfo) {
            var otherTri = otherInfo.tri;
            var otherIndex = otherInfo.index;
            var otherNormals = otherTri.normals;
            var otherVertCount = otherNormals.length;
            var otherFaceNormal = otherTri.faceNormal;

            // NOTE: If the angle between faces is > 67.5 degrees then assume it's
            // hard edge. There are some cases where the line segments do not line up exactly
            // with or span multiple triangle edges (see Lunar Vehicle wheels).
            if (Math.abs(otherTri.faceNormal.dot(_tri.faceNormal)) < 0.25) {
              continue;
            }

            // if this triangle has already been traversed then it won't be in
            // the halfEdgeList. If it has not then add it to the queue and delete
            // it so it won't be found again.
            if (reverseHash in halfEdgeList) {
              queue.push(otherInfo);
              delete halfEdgeList[reverseHash];
            }

            // share the first normal
            var otherNext = (otherIndex + 1) % otherVertCount;
            if (vertNormals[_index] && otherNormals[otherNext] && vertNormals[_index] !== otherNormals[otherNext]) {
              otherNormals[otherNext].norm.add(vertNormals[_index].norm);
              vertNormals[_index].norm = otherNormals[otherNext].norm;
            }
            var sharedNormal1 = vertNormals[_index] || otherNormals[otherNext];
            if (sharedNormal1 === null) {
              // it's possible to encounter an edge of a triangle that has already been traversed meaning
              // both edges already have different normals defined and shared. To work around this we create
              // a wrapper object so when those edges are merged the normals can be updated everywhere.
              sharedNormal1 = {
                norm: new THREE.Vector3()
              };
              normals.push(sharedNormal1.norm);
            }
            if (vertNormals[_index] === null) {
              vertNormals[_index] = sharedNormal1;
              sharedNormal1.norm.add(faceNormal);
            }
            if (otherNormals[otherNext] === null) {
              otherNormals[otherNext] = sharedNormal1;
              sharedNormal1.norm.add(otherFaceNormal);
            }

            // share the second normal
            if (vertNormals[_next] && otherNormals[otherIndex] && vertNormals[_next] !== otherNormals[otherIndex]) {
              otherNormals[otherIndex].norm.add(vertNormals[_next].norm);
              vertNormals[_next].norm = otherNormals[otherIndex].norm;
            }
            var sharedNormal2 = vertNormals[_next] || otherNormals[otherIndex];
            if (sharedNormal2 === null) {
              sharedNormal2 = {
                norm: new THREE.Vector3()
              };
              normals.push(sharedNormal2.norm);
            }
            if (vertNormals[_next] === null) {
              vertNormals[_next] = sharedNormal2;
              sharedNormal2.norm.add(faceNormal);
            }
            if (otherNormals[otherIndex] === null) {
              otherNormals[otherIndex] = sharedNormal2;
              sharedNormal2.norm.add(otherFaceNormal);
            }
          }
        }
      }
    }

    // The normals of each face have been added up so now we average them by normalizing the vector.
    for (var _i4 = 0, _l3 = normals.length; _i4 < _l3; _i4++) {
      normals[_i4].normalize();
    }
  }
  function isPartType(type) {
    return type === 'Part' || type === 'Unofficial_Part';
  }
  function isPrimitiveType(type) {
    return /primitive/i.test(type) || type === 'Subpart';
  }
  var LineParser = /*#__PURE__*/function () {
    function LineParser(line, lineNumber) {
      _classCallCheck(this, LineParser);
      this.line = line;
      this.lineLength = line.length;
      this.currentCharIndex = 0;
      this.currentChar = ' ';
      this.lineNumber = lineNumber;
    }
    _createClass(LineParser, [{
      key: "seekNonSpace",
      value: function seekNonSpace() {
        while (this.currentCharIndex < this.lineLength) {
          this.currentChar = this.line.charAt(this.currentCharIndex);
          if (this.currentChar !== ' ' && this.currentChar !== '\t') {
            return;
          }
          this.currentCharIndex++;
        }
      }
    }, {
      key: "getToken",
      value: function getToken() {
        var pos0 = this.currentCharIndex++;

        // Seek space
        while (this.currentCharIndex < this.lineLength) {
          this.currentChar = this.line.charAt(this.currentCharIndex);
          if (this.currentChar === ' ' || this.currentChar === '\t') {
            break;
          }
          this.currentCharIndex++;
        }
        var pos1 = this.currentCharIndex;
        this.seekNonSpace();
        return this.line.substring(pos0, pos1);
      }
    }, {
      key: "getVector",
      value: function getVector() {
        return new THREE.Vector3(parseFloat(this.getToken()), parseFloat(this.getToken()), parseFloat(this.getToken()));
      }
    }, {
      key: "getRemainingString",
      value: function getRemainingString() {
        return this.line.substring(this.currentCharIndex, this.lineLength);
      }
    }, {
      key: "isAtTheEnd",
      value: function isAtTheEnd() {
        return this.currentCharIndex >= this.lineLength;
      }
    }, {
      key: "setToEnd",
      value: function setToEnd() {
        this.currentCharIndex = this.lineLength;
      }
    }, {
      key: "getLineNumberString",
      value: function getLineNumberString() {
        return this.lineNumber >= 0 ? ' at line ' + this.lineNumber : '';
      }
    }]);
    return LineParser;
  }(); // Fetches and parses an intermediate representation of LDraw parts files.
  var LDrawParsedCache = /*#__PURE__*/function () {
    function LDrawParsedCache(loader) {
      _classCallCheck(this, LDrawParsedCache);
      this.loader = loader;
      this._cache = {};
    }
    _createClass(LDrawParsedCache, [{
      key: "cloneResult",
      value: function cloneResult(original) {
        var result = {};

        // vertices are transformed and normals computed before being converted to geometry
        // so these pieces must be cloned.
        result.faces = original.faces.map(function (face) {
          return {
            colorCode: face.colorCode,
            material: face.material,
            vertices: face.vertices.map(function (v) {
              return v.clone();
            }),
            normals: face.normals.map(function () {
              return null;
            }),
            faceNormal: null
          };
        });
        result.conditionalSegments = original.conditionalSegments.map(function (face) {
          return {
            colorCode: face.colorCode,
            material: face.material,
            vertices: face.vertices.map(function (v) {
              return v.clone();
            }),
            controlPoints: face.controlPoints.map(function (v) {
              return v.clone();
            })
          };
        });
        result.lineSegments = original.lineSegments.map(function (face) {
          return {
            colorCode: face.colorCode,
            material: face.material,
            vertices: face.vertices.map(function (v) {
              return v.clone();
            })
          };
        });

        // none if this is subsequently modified
        result.type = original.type;
        result.category = original.category;
        result.keywords = original.keywords;
        result.author = original.author;
        result.subobjects = original.subobjects;
        result.fileName = original.fileName;
        result.totalFaces = original.totalFaces;
        result.startingBuildingStep = original.startingBuildingStep;
        result.materials = original.materials;
        result.group = null;
        return result;
      }
    }, {
      key: "fetchData",
      value: function () {
        var _fetchData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(fileName) {
          var triedLowerCase, locationState, subobjectURL, loader, fileLoader, text;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                triedLowerCase = false;
                locationState = FILE_LOCATION_TRY_PARTS;
              case 2:
                if (!(locationState !== FILE_LOCATION_NOT_FOUND)) {
                  _context.next = 40;
                  break;
                }
                subobjectURL = fileName;
                _context.t0 = locationState;
                _context.next = _context.t0 === FILE_LOCATION_AS_IS ? 7 : _context.t0 === FILE_LOCATION_TRY_PARTS ? 9 : _context.t0 === FILE_LOCATION_TRY_P ? 12 : _context.t0 === FILE_LOCATION_TRY_MODELS ? 15 : _context.t0 === FILE_LOCATION_TRY_RELATIVE ? 18 : _context.t0 === FILE_LOCATION_TRY_ABSOLUTE ? 21 : 23;
                break;
              case 7:
                locationState = locationState + 1;
                return _context.abrupt("break", 23);
              case 9:
                subobjectURL = 'parts/' + subobjectURL;
                locationState = locationState + 1;
                return _context.abrupt("break", 23);
              case 12:
                subobjectURL = 'p/' + subobjectURL;
                locationState = locationState + 1;
                return _context.abrupt("break", 23);
              case 15:
                subobjectURL = 'models/' + subobjectURL;
                locationState = locationState + 1;
                return _context.abrupt("break", 23);
              case 18:
                subobjectURL = fileName.substring(0, fileName.lastIndexOf('/') + 1) + subobjectURL;
                locationState = locationState + 1;
                return _context.abrupt("break", 23);
              case 21:
                if (triedLowerCase) {
                  // Try absolute path
                  locationState = FILE_LOCATION_NOT_FOUND;
                } else {
                  // Next attempt is lower case
                  fileName = fileName.toLowerCase();
                  subobjectURL = fileName;
                  triedLowerCase = true;
                  locationState = FILE_LOCATION_TRY_PARTS;
                }
                return _context.abrupt("break", 23);
              case 23:
                loader = this.loader;
                fileLoader = new THREE.FileLoader(loader.manager);
                fileLoader.setPath(loader.partsLibraryPath);
                fileLoader.setRequestHeader(loader.requestHeader);
                fileLoader.setWithCredentials(loader.withCredentials);
                _context.prev = 28;
                _context.next = 31;
                return fileLoader.loadAsync(subobjectURL);
              case 31:
                text = _context.sent;
                return _context.abrupt("return", text);
              case 35:
                _context.prev = 35;
                _context.t1 = _context["catch"](28);
                return _context.abrupt("continue", 2);
              case 38:
                _context.next = 2;
                break;
              case 40:
                throw new Error('LDrawLoader: Subobject "' + fileName + '" could not be loaded.');
              case 41:
              case "end":
                return _context.stop();
            }
          }, _callee, this, [[28, 35]]);
        }));
        function fetchData(_x) {
          return _fetchData.apply(this, arguments);
        }
        return fetchData;
      }()
    }, {
      key: "parse",
      value: function parse(text) {
        var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var loader = this.loader;

        // final results
        var faces = [];
        var lineSegments = [];
        var conditionalSegments = [];
        var subobjects = [];
        var materials = {};
        var getLocalMaterial = function getLocalMaterial(colorCode) {
          return materials[colorCode] || null;
        };
        var type = 'Model';
        var category = null;
        var keywords = null;
        var author = null;
        var totalFaces = 0;

        // split into lines
        if (text.indexOf('\r\n') !== -1) {
          // This is faster than String.split with regex that splits on both
          text = text.replace(/\r\n/g, '\n');
        }
        var lines = text.split('\n');
        var numLines = lines.length;
        var parsingEmbeddedFiles = false;
        var currentEmbeddedFileName = null;
        var currentEmbeddedText = null;
        var bfcCertified = false;
        var bfcCCW = true;
        var bfcInverted = false;
        var bfcCull = true;
        var startingBuildingStep = false;

        // Parse all line commands
        for (var lineIndex = 0; lineIndex < numLines; lineIndex++) {
          var line = lines[lineIndex];
          if (line.length === 0) continue;
          if (parsingEmbeddedFiles) {
            if (line.startsWith('0 FILE ')) {
              // Save previous embedded file in the cache
              this.setData(currentEmbeddedFileName, currentEmbeddedText);

              // New embedded text file
              currentEmbeddedFileName = line.substring(7);
              currentEmbeddedText = '';
            } else {
              currentEmbeddedText += line + '\n';
            }
            continue;
          }
          var lp = new LineParser(line, lineIndex + 1);
          lp.seekNonSpace();
          if (lp.isAtTheEnd()) {
            // Empty line
            continue;
          }

          // Parse the line type
          var lineType = lp.getToken();
          var material = void 0;
          var colorCode = void 0;
          var segment = void 0;
          var ccw = void 0;
          var doubleSided = void 0;
          var v0 = void 0,
            v1 = void 0,
            v2 = void 0,
            v3 = void 0,
            c0 = void 0,
            c1 = void 0;
          switch (lineType) {
            // Line type 0: Comment or META
            case '0':
              // Parse meta directive
              var meta = lp.getToken();
              if (meta) {
                switch (meta) {
                  case '!LDRAW_ORG':
                    type = lp.getToken();
                    break;
                  case '!COLOUR':
                    material = loader.parseColorMetaDirective(lp);
                    if (material) {
                      materials[material.userData.code] = material;
                    } else {
                      console.warn('LDrawLoader: Error parsing material' + lp.getLineNumberString());
                    }
                    break;
                  case '!CATEGORY':
                    category = lp.getToken();
                    break;
                  case '!KEYWORDS':
                    var newKeywords = lp.getRemainingString().split(',');
                    if (newKeywords.length > 0) {
                      if (!keywords) {
                        keywords = [];
                      }
                      newKeywords.forEach(function (keyword) {
                        keywords.push(keyword.trim());
                      });
                    }
                    break;
                  case 'FILE':
                    if (lineIndex > 0) {
                      // Start embedded text files parsing
                      parsingEmbeddedFiles = true;
                      currentEmbeddedFileName = lp.getRemainingString();
                      currentEmbeddedText = '';
                      bfcCertified = false;
                      bfcCCW = true;
                    }
                    break;
                  case 'BFC':
                    // Changes to the backface culling state
                    while (!lp.isAtTheEnd()) {
                      var token = lp.getToken();
                      switch (token) {
                        case 'CERTIFY':
                        case 'NOCERTIFY':
                          bfcCertified = token === 'CERTIFY';
                          bfcCCW = true;
                          break;
                        case 'CW':
                        case 'CCW':
                          bfcCCW = token === 'CCW';
                          break;
                        case 'INVERTNEXT':
                          bfcInverted = true;
                          break;
                        case 'CLIP':
                        case 'NOCLIP':
                          bfcCull = token === 'CLIP';
                          break;
                        default:
                          console.warn('THREE.LDrawLoader: BFC directive "' + token + '" is unknown.');
                          break;
                      }
                    }
                    break;
                  case 'STEP':
                    startingBuildingStep = true;
                    break;
                  case 'Author:':
                    author = lp.getToken();
                    break;
                  default:
                    // Other meta directives are not implemented
                    break;
                }
              }
              break;

            // Line type 1: Sub-object file
            case '1':
              colorCode = lp.getToken();
              material = getLocalMaterial(colorCode);
              var posX = parseFloat(lp.getToken());
              var posY = parseFloat(lp.getToken());
              var posZ = parseFloat(lp.getToken());
              var m0 = parseFloat(lp.getToken());
              var m1 = parseFloat(lp.getToken());
              var m2 = parseFloat(lp.getToken());
              var m3 = parseFloat(lp.getToken());
              var m4 = parseFloat(lp.getToken());
              var m5 = parseFloat(lp.getToken());
              var m6 = parseFloat(lp.getToken());
              var m7 = parseFloat(lp.getToken());
              var m8 = parseFloat(lp.getToken());
              var matrix = new THREE.Matrix4().set(m0, m1, m2, posX, m3, m4, m5, posY, m6, m7, m8, posZ, 0, 0, 0, 1);
              var _fileName = lp.getRemainingString().trim().replace(/\\/g, '/');
              if (loader.fileMap[_fileName]) {
                // Found the subobject path in the preloaded file path map
                _fileName = loader.fileMap[_fileName];
              } else {
                // Standardized subfolders
                if (_fileName.startsWith('s/')) {
                  _fileName = 'parts/' + _fileName;
                } else if (_fileName.startsWith('48/')) {
                  _fileName = 'p/' + _fileName;
                }
              }
              subobjects.push({
                material: material,
                colorCode: colorCode,
                matrix: matrix,
                fileName: _fileName,
                inverted: bfcInverted,
                startingBuildingStep: startingBuildingStep
              });
              startingBuildingStep = false;
              bfcInverted = false;
              break;

            // Line type 2: Line segment
            case '2':
              colorCode = lp.getToken();
              material = getLocalMaterial(colorCode);
              v0 = lp.getVector();
              v1 = lp.getVector();
              segment = {
                material: material,
                colorCode: colorCode,
                vertices: [v0, v1]
              };
              lineSegments.push(segment);
              break;

            // Line type 5: Conditional Line segment
            case '5':
              colorCode = lp.getToken();
              material = getLocalMaterial(colorCode);
              v0 = lp.getVector();
              v1 = lp.getVector();
              c0 = lp.getVector();
              c1 = lp.getVector();
              segment = {
                material: material,
                colorCode: colorCode,
                vertices: [v0, v1],
                controlPoints: [c0, c1]
              };
              conditionalSegments.push(segment);
              break;

            // Line type 3: Triangle
            case '3':
              colorCode = lp.getToken();
              material = getLocalMaterial(colorCode);
              ccw = bfcCCW;
              doubleSided = !bfcCertified || !bfcCull;
              if (ccw === true) {
                v0 = lp.getVector();
                v1 = lp.getVector();
                v2 = lp.getVector();
              } else {
                v2 = lp.getVector();
                v1 = lp.getVector();
                v0 = lp.getVector();
              }
              faces.push({
                material: material,
                colorCode: colorCode,
                faceNormal: null,
                vertices: [v0, v1, v2],
                normals: [null, null, null]
              });
              totalFaces++;
              if (doubleSided === true) {
                faces.push({
                  material: material,
                  colorCode: colorCode,
                  faceNormal: null,
                  vertices: [v2, v1, v0],
                  normals: [null, null, null]
                });
                totalFaces++;
              }
              break;

            // Line type 4: Quadrilateral
            case '4':
              colorCode = lp.getToken();
              material = getLocalMaterial(colorCode);
              ccw = bfcCCW;
              doubleSided = !bfcCertified || !bfcCull;
              if (ccw === true) {
                v0 = lp.getVector();
                v1 = lp.getVector();
                v2 = lp.getVector();
                v3 = lp.getVector();
              } else {
                v3 = lp.getVector();
                v2 = lp.getVector();
                v1 = lp.getVector();
                v0 = lp.getVector();
              }

              // specifically place the triangle diagonal in the v0 and v1 slots so we can
              // account for the doubling of vertices later when smoothing normals.
              faces.push({
                material: material,
                colorCode: colorCode,
                faceNormal: null,
                vertices: [v0, v1, v2, v3],
                normals: [null, null, null, null]
              });
              totalFaces += 2;
              if (doubleSided === true) {
                faces.push({
                  material: material,
                  colorCode: colorCode,
                  faceNormal: null,
                  vertices: [v3, v2, v1, v0],
                  normals: [null, null, null, null]
                });
                totalFaces += 2;
              }
              break;
            default:
              throw new Error('LDrawLoader: Unknown line type "' + lineType + '"' + lp.getLineNumberString() + '.');
          }
        }
        if (parsingEmbeddedFiles) {
          this.setData(currentEmbeddedFileName, currentEmbeddedText);
        }
        return {
          faces: faces,
          conditionalSegments: conditionalSegments,
          lineSegments: lineSegments,
          type: type,
          category: category,
          keywords: keywords,
          author: author,
          subobjects: subobjects,
          totalFaces: totalFaces,
          startingBuildingStep: startingBuildingStep,
          materials: materials,
          fileName: fileName,
          group: null
        };
      }

      // returns an (optionally cloned) instance of the data
    }, {
      key: "getData",
      value: function getData(fileName) {
        var clone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var key = fileName.toLowerCase();
        var result = this._cache[key];
        if (result === null || result instanceof Promise) {
          return null;
        }
        if (clone) {
          return this.cloneResult(result);
        } else {
          return result;
        }
      }

      // kicks off a fetch and parse of the requested data if it hasn't already been loaded. Returns when
      // the data is ready to use and can be retrieved synchronously with "getData".
    }, {
      key: "ensureDataLoaded",
      value: function () {
        var _ensureDataLoaded = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(fileName) {
          var _this3 = this;
          var key;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                key = fileName.toLowerCase();
                if (!(key in this._cache)) {
                  // replace the promise with a copy of the parsed data for immediate processing
                  this._cache[key] = this.fetchData(fileName).then(function (text) {
                    var info = _this3.parse(text, fileName);
                    _this3._cache[key] = info;
                    return info;
                  });
                }
                _context2.next = 4;
                return this._cache[key];
              case 4:
              case "end":
                return _context2.stop();
            }
          }, _callee2, this);
        }));
        function ensureDataLoaded(_x2) {
          return _ensureDataLoaded.apply(this, arguments);
        }
        return ensureDataLoaded;
      }() // sets the data in the cache from parsed data
    }, {
      key: "setData",
      value: function setData(fileName, text) {
        var key = fileName.toLowerCase();
        this._cache[key] = this.parse(text, fileName);
      }
    }]);
    return LDrawParsedCache;
  }(); // returns the material for an associated color code. If the color code is 16 for a face or 24 for
  // an edge then the passthroughColorCode is used.
  function getMaterialFromCode(colorCode, parentColorCode, materialHierarchy, forEdge) {
    var isPassthrough = !forEdge && colorCode === MAIN_COLOUR_CODE || forEdge && colorCode === MAIN_EDGE_COLOUR_CODE;
    if (isPassthrough) {
      colorCode = parentColorCode;
    }
    return materialHierarchy[colorCode] || null;
  }

  // Class used to parse and build LDraw parts as three.js objects and cache them if they're a "Part" type.
  var LDrawPartsGeometryCache = /*#__PURE__*/function () {
    function LDrawPartsGeometryCache(loader) {
      _classCallCheck(this, LDrawPartsGeometryCache);
      this.loader = loader;
      this.parseCache = new LDrawParsedCache(loader);
      this._cache = {};
    }

    // Convert the given file information into a mesh by processing subobjects.
    _createClass(LDrawPartsGeometryCache, [{
      key: "processIntoMesh",
      value: function () {
        var _processIntoMesh = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(info) {
          var _this4 = this;
          var loader, parseCache, faceMaterials, processInfoSubobjects, i, l, checkSubSegments, group;
          return _regeneratorRuntime().wrap(function _callee4$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                loader = this.loader;
                parseCache = this.parseCache;
                faceMaterials = new Set(); // Processes the part subobject information to load child parts and merge geometry onto part
                // piece object.
                processInfoSubobjects = /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(info) {
                    var subobject,
                      subobjects,
                      promises,
                      _loop,
                      i,
                      l,
                      group,
                      subobjectInfos,
                      _i5,
                      _l4,
                      _subobject,
                      subobjectInfo,
                      subobjectGroup,
                      parentLineSegments,
                      parentConditionalSegments,
                      parentFaces,
                      lineSegments,
                      conditionalSegments,
                      faces,
                      matrix,
                      inverted,
                      matrixScaleInverted,
                      colorCode,
                      lineColorCode,
                      _i6,
                      _l5,
                      ls,
                      vertices,
                      _i7,
                      _l6,
                      os,
                      _vertices3,
                      controlPoints,
                      _i8,
                      _l7,
                      tri,
                      _vertices4,
                      _i9,
                      _l8,
                      _args4 = arguments;
                    return _regeneratorRuntime().wrap(function _callee3$(_context4) {
                      while (1) switch (_context4.prev = _context4.next) {
                        case 0:
                          subobject = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : null;
                          subobjects = info.subobjects;
                          promises = []; // Trigger load of all subobjects. If a subobject isn't a primitive then load it as a separate
                          // group which lets instruction steps apply correctly.
                          _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                            var subobject, promise;
                            return _regeneratorRuntime().wrap(function _loop$(_context3) {
                              while (1) switch (_context3.prev = _context3.next) {
                                case 0:
                                  subobject = subobjects[i];
                                  promise = parseCache.ensureDataLoaded(subobject.fileName).then(function () {
                                    var subobjectInfo = parseCache.getData(subobject.fileName, false);
                                    if (!isPrimitiveType(subobjectInfo.type)) {
                                      return _this4.loadModel(subobject.fileName)["catch"](function (error) {
                                        console.warn(error);
                                        return null;
                                      });
                                    }
                                    return processInfoSubobjects(parseCache.getData(subobject.fileName), subobject);
                                  });
                                  promises.push(promise);
                                case 3:
                                case "end":
                                  return _context3.stop();
                              }
                            }, _loop);
                          });
                          i = 0, l = subobjects.length;
                        case 5:
                          if (!(i < l)) {
                            _context4.next = 10;
                            break;
                          }
                          return _context4.delegateYield(_loop(), "t0", 7);
                        case 7:
                          i++;
                          _context4.next = 5;
                          break;
                        case 10:
                          group = new THREE.Group();
                          group.userData.category = info.category;
                          group.userData.keywords = info.keywords;
                          group.userData.author = info.author;
                          group.userData.type = info.type;
                          group.userData.fileName = info.fileName;
                          info.group = group;
                          _context4.next = 19;
                          return Promise.all(promises);
                        case 19:
                          subobjectInfos = _context4.sent;
                          _i5 = 0, _l4 = subobjectInfos.length;
                        case 21:
                          if (!(_i5 < _l4)) {
                            _context4.next = 54;
                            break;
                          }
                          _subobject = info.subobjects[_i5];
                          subobjectInfo = subobjectInfos[_i5];
                          if (!(subobjectInfo === null)) {
                            _context4.next = 26;
                            break;
                          }
                          return _context4.abrupt("continue", 51);
                        case 26:
                          if (!subobjectInfo.isGroup) {
                            _context4.next = 35;
                            break;
                          }
                          subobjectGroup = subobjectInfo;
                          _subobject.matrix.decompose(subobjectGroup.position, subobjectGroup.quaternion, subobjectGroup.scale);
                          subobjectGroup.userData.startingBuildingStep = _subobject.startingBuildingStep;
                          subobjectGroup.name = _subobject.fileName;
                          loader.applyMaterialsToMesh(subobjectGroup, _subobject.colorCode, info.materials);
                          subobjectGroup.userData.colorCode = _subobject.colorCode;
                          group.add(subobjectGroup);
                          return _context4.abrupt("continue", 51);
                        case 35:
                          // add the subobject group if it has children in case it has both children and primitives
                          if (subobjectInfo.group.children.length) {
                            group.add(subobjectInfo.group);
                          }

                          // transform the primitives into the local space of the parent piece and append them to
                          // to the parent primitives list.
                          parentLineSegments = info.lineSegments;
                          parentConditionalSegments = info.conditionalSegments;
                          parentFaces = info.faces;
                          lineSegments = subobjectInfo.lineSegments;
                          conditionalSegments = subobjectInfo.conditionalSegments;
                          faces = subobjectInfo.faces;
                          matrix = _subobject.matrix;
                          inverted = _subobject.inverted;
                          matrixScaleInverted = matrix.determinant() < 0;
                          colorCode = _subobject.colorCode;
                          lineColorCode = colorCode === MAIN_COLOUR_CODE ? MAIN_EDGE_COLOUR_CODE : colorCode;
                          for (_i6 = 0, _l5 = lineSegments.length; _i6 < _l5; _i6++) {
                            ls = lineSegments[_i6];
                            vertices = ls.vertices;
                            vertices[0].applyMatrix4(matrix);
                            vertices[1].applyMatrix4(matrix);
                            ls.colorCode = ls.colorCode === MAIN_EDGE_COLOUR_CODE ? lineColorCode : ls.colorCode;
                            ls.material = ls.material || getMaterialFromCode(ls.colorCode, ls.colorCode, info.materials, true);
                            parentLineSegments.push(ls);
                          }
                          for (_i7 = 0, _l6 = conditionalSegments.length; _i7 < _l6; _i7++) {
                            os = conditionalSegments[_i7];
                            _vertices3 = os.vertices;
                            controlPoints = os.controlPoints;
                            _vertices3[0].applyMatrix4(matrix);
                            _vertices3[1].applyMatrix4(matrix);
                            controlPoints[0].applyMatrix4(matrix);
                            controlPoints[1].applyMatrix4(matrix);
                            os.colorCode = os.colorCode === MAIN_EDGE_COLOUR_CODE ? lineColorCode : os.colorCode;
                            os.material = os.material || getMaterialFromCode(os.colorCode, os.colorCode, info.materials, true);
                            parentConditionalSegments.push(os);
                          }
                          for (_i8 = 0, _l7 = faces.length; _i8 < _l7; _i8++) {
                            tri = faces[_i8];
                            _vertices4 = tri.vertices;
                            for (_i9 = 0, _l8 = _vertices4.length; _i9 < _l8; _i9++) {
                              _vertices4[_i9].applyMatrix4(matrix);
                            }
                            tri.colorCode = tri.colorCode === MAIN_COLOUR_CODE ? colorCode : tri.colorCode;
                            tri.material = tri.material || getMaterialFromCode(tri.colorCode, colorCode, info.materials, false);
                            faceMaterials.add(tri.colorCode);

                            // If the scale of the object is negated then the triangle winding order
                            // needs to be flipped.
                            if (matrixScaleInverted !== inverted) {
                              _vertices4.reverse();
                            }
                            parentFaces.push(tri);
                          }
                          info.totalFaces += subobjectInfo.totalFaces;
                        case 51:
                          _i5++;
                          _context4.next = 21;
                          break;
                        case 54:
                          // Apply the parent subobjects pass through material code to this object. This is done several times due
                          // to material scoping.
                          if (subobject) {
                            loader.applyMaterialsToMesh(group, subobject.colorCode, info.materials);
                            group.userData.colorCode = subobject.colorCode;
                          }
                          return _context4.abrupt("return", info);
                        case 56:
                        case "end":
                          return _context4.stop();
                      }
                    }, _callee3);
                  }));
                  return function processInfoSubobjects(_x4) {
                    return _ref3.apply(this, arguments);
                  };
                }(); // Track material use to see if we need to use the normal smooth slow path for hard edges.
                for (i = 0, l = info.faces; i < l; i++) {
                  faceMaterials.add(info.faces[i].colorCode);
                }
                _context5.next = 7;
                return processInfoSubobjects(info);
              case 7:
                if (loader.smoothNormals) {
                  checkSubSegments = faceMaterials.size > 1;
                  generateFaceNormals(info.faces);
                  smoothNormals(info.faces, info.lineSegments, checkSubSegments);
                }

                // Add the primitive objects and metadata.
                group = info.group;
                if (info.faces.length > 0) {
                  group.add(createObject(info.faces, 3, false, info.totalFaces));
                }
                if (info.lineSegments.length > 0) {
                  group.add(createObject(info.lineSegments, 2));
                }
                if (info.conditionalSegments.length > 0) {
                  group.add(createObject(info.conditionalSegments, 2, true));
                }
                return _context5.abrupt("return", group);
              case 13:
              case "end":
                return _context5.stop();
            }
          }, _callee4, this);
        }));
        function processIntoMesh(_x3) {
          return _processIntoMesh.apply(this, arguments);
        }
        return processIntoMesh;
      }()
    }, {
      key: "hasCachedModel",
      value: function hasCachedModel(fileName) {
        return fileName !== null && fileName.toLowerCase() in this._cache;
      }
    }, {
      key: "getCachedModel",
      value: function () {
        var _getCachedModel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(fileName) {
          var key, group;
          return _regeneratorRuntime().wrap(function _callee5$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                if (!(fileName !== null && this.hasCachedModel(fileName))) {
                  _context6.next = 8;
                  break;
                }
                key = fileName.toLowerCase();
                _context6.next = 4;
                return this._cache[key];
              case 4:
                group = _context6.sent;
                return _context6.abrupt("return", group.clone());
              case 8:
                return _context6.abrupt("return", null);
              case 9:
              case "end":
                return _context6.stop();
            }
          }, _callee5, this);
        }));
        function getCachedModel(_x5) {
          return _getCachedModel.apply(this, arguments);
        }
        return getCachedModel;
      }() // Loads and parses the model with the given file name. Returns a cached copy if available.
    }, {
      key: "loadModel",
      value: function () {
        var _loadModel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(fileName) {
          var parseCache, key, info, promise, group;
          return _regeneratorRuntime().wrap(function _callee6$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                parseCache = this.parseCache;
                key = fileName.toLowerCase();
                if (!this.hasCachedModel(fileName)) {
                  _context7.next = 6;
                  break;
                }
                return _context7.abrupt("return", this.getCachedModel(fileName));
              case 6:
                _context7.next = 8;
                return parseCache.ensureDataLoaded(fileName);
              case 8:
                info = parseCache.getData(fileName);
                promise = this.processIntoMesh(info); // Now that the file has loaded it's possible that another part parse has been waiting in parallel
                // so check the cache again to see if it's been added since the last async operation so we don't
                // do unnecessary work.
                if (!this.hasCachedModel(fileName)) {
                  _context7.next = 12;
                  break;
                }
                return _context7.abrupt("return", this.getCachedModel(fileName));
              case 12:
                // Cache object if it's a part so it can be reused later.
                if (isPartType(info.type)) {
                  this._cache[key] = promise;
                }

                // return a copy
                _context7.next = 15;
                return promise;
              case 15:
                group = _context7.sent;
                return _context7.abrupt("return", group.clone());
              case 17:
              case "end":
                return _context7.stop();
            }
          }, _callee6, this);
        }));
        function loadModel(_x6) {
          return _loadModel.apply(this, arguments);
        }
        return loadModel;
      }() // parses the given model text into a renderable object. Returns cached copy if available.
    }, {
      key: "parseModel",
      value: function () {
        var _parseModel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(text) {
          var parseCache, info;
          return _regeneratorRuntime().wrap(function _callee7$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                parseCache = this.parseCache;
                info = parseCache.parse(text);
                if (!(isPartType(info.type) && this.hasCachedModel(info.fileName))) {
                  _context8.next = 4;
                  break;
                }
                return _context8.abrupt("return", this.getCachedModel(info.fileName));
              case 4:
                return _context8.abrupt("return", this.processIntoMesh(info));
              case 5:
              case "end":
                return _context8.stop();
            }
          }, _callee7, this);
        }));
        function parseModel(_x7) {
          return _parseModel.apply(this, arguments);
        }
        return parseModel;
      }()
    }]);
    return LDrawPartsGeometryCache;
  }();
  function sortByMaterial(a, b) {
    if (a.colorCode === b.colorCode) {
      return 0;
    }
    if (a.colorCode < b.colorCode) {
      return -1;
    }
    return 1;
  }
  function createObject(elements, elementSize) {
    var isConditionalSegments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var totalElements = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    // Creates a THREE.LineSegments (elementSize = 2) or a THREE.Mesh (elementSize = 3 )
    // With per face / segment material, implemented with mesh groups and materials array

    // Sort the faces or line segments by color code to make later the mesh groups
    elements.sort(sortByMaterial);
    if (totalElements === null) {
      totalElements = elements.length;
    }
    var positions = new Float32Array(elementSize * totalElements * 3);
    var normals = elementSize === 3 ? new Float32Array(elementSize * totalElements * 3) : null;
    var materials = [];
    var quadArray = new Array(6);
    var bufferGeometry = new THREE.BufferGeometry();
    var prevMaterial = null;
    var index0 = 0;
    var numGroupVerts = 0;
    var offset = 0;
    for (var iElem = 0, nElem = elements.length; iElem < nElem; iElem++) {
      var elem = elements[iElem];
      var vertices = elem.vertices;
      if (vertices.length === 4) {
        quadArray[0] = vertices[0];
        quadArray[1] = vertices[1];
        quadArray[2] = vertices[2];
        quadArray[3] = vertices[0];
        quadArray[4] = vertices[2];
        quadArray[5] = vertices[3];
        vertices = quadArray;
      }
      for (var j = 0, l = vertices.length; j < l; j++) {
        var v = vertices[j];
        var index = offset + j * 3;
        positions[index + 0] = v.x;
        positions[index + 1] = v.y;
        positions[index + 2] = v.z;
      }

      // create the normals array if this is a set of faces
      if (elementSize === 3) {
        if (!elem.faceNormal) {
          var v0 = vertices[0];
          var v1 = vertices[1];
          var v2 = vertices[2];
          _tempVec0.subVectors(v1, v0);
          _tempVec1.subVectors(v2, v1);
          elem.faceNormal = new THREE.Vector3().crossVectors(_tempVec0, _tempVec1).normalize();
        }
        var elemNormals = elem.normals;
        if (elemNormals.length === 4) {
          quadArray[0] = elemNormals[0];
          quadArray[1] = elemNormals[1];
          quadArray[2] = elemNormals[2];
          quadArray[3] = elemNormals[0];
          quadArray[4] = elemNormals[2];
          quadArray[5] = elemNormals[3];
          elemNormals = quadArray;
        }
        for (var _j = 0, _l9 = elemNormals.length; _j < _l9; _j++) {
          // use face normal if a vertex normal is not provided
          var n = elem.faceNormal;
          if (elemNormals[_j]) {
            n = elemNormals[_j].norm;
          }
          var _index2 = offset + _j * 3;
          normals[_index2 + 0] = n.x;
          normals[_index2 + 1] = n.y;
          normals[_index2 + 2] = n.z;
        }
      }
      if (prevMaterial !== elem.colorCode) {
        if (prevMaterial !== null) {
          bufferGeometry.addGroup(index0, numGroupVerts, materials.length - 1);
        }
        var material = elem.material;
        if (material !== null) {
          if (elementSize === 3) {
            materials.push(material);
          } else if (elementSize === 2) {
            if (isConditionalSegments) {
              materials.push(material.userData.edgeMaterial.userData.conditionalEdgeMaterial);
            } else {
              materials.push(material.userData.edgeMaterial);
            }
          }
        } else {
          // If a material has not been made available yet then keep the color code string in the material array
          // to save the spot for the material once a parent scopes materials are being applied to the object.
          materials.push(elem.colorCode);
        }
        prevMaterial = elem.colorCode;
        index0 = offset / 3;
        numGroupVerts = vertices.length;
      } else {
        numGroupVerts += vertices.length;
      }
      offset += 3 * vertices.length;
    }
    if (numGroupVerts > 0) {
      bufferGeometry.addGroup(index0, Infinity, materials.length - 1);
    }
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    if (normals !== null) {
      bufferGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    }
    var object3d = null;
    if (elementSize === 2) {
      if (isConditionalSegments) {
        object3d = new ConditionalLineSegments(bufferGeometry, materials.length === 1 ? materials[0] : materials);
      } else {
        object3d = new THREE.LineSegments(bufferGeometry, materials.length === 1 ? materials[0] : materials);
      }
    } else if (elementSize === 3) {
      object3d = new THREE.Mesh(bufferGeometry, materials.length === 1 ? materials[0] : materials);
    }
    if (isConditionalSegments) {
      object3d.isConditionalLine = true;
      var controlArray0 = new Float32Array(elements.length * 3 * 2);
      var controlArray1 = new Float32Array(elements.length * 3 * 2);
      var directionArray = new Float32Array(elements.length * 3 * 2);
      for (var i = 0, _l10 = elements.length; i < _l10; i++) {
        var os = elements[i];
        var _vertices5 = os.vertices;
        var controlPoints = os.controlPoints;
        var c0 = controlPoints[0];
        var c1 = controlPoints[1];
        var _v5 = _vertices5[0];
        var _v6 = _vertices5[1];
        var _index3 = i * 3 * 2;
        controlArray0[_index3 + 0] = c0.x;
        controlArray0[_index3 + 1] = c0.y;
        controlArray0[_index3 + 2] = c0.z;
        controlArray0[_index3 + 3] = c0.x;
        controlArray0[_index3 + 4] = c0.y;
        controlArray0[_index3 + 5] = c0.z;
        controlArray1[_index3 + 0] = c1.x;
        controlArray1[_index3 + 1] = c1.y;
        controlArray1[_index3 + 2] = c1.z;
        controlArray1[_index3 + 3] = c1.x;
        controlArray1[_index3 + 4] = c1.y;
        controlArray1[_index3 + 5] = c1.z;
        directionArray[_index3 + 0] = _v6.x - _v5.x;
        directionArray[_index3 + 1] = _v6.y - _v5.y;
        directionArray[_index3 + 2] = _v6.z - _v5.z;
        directionArray[_index3 + 3] = _v6.x - _v5.x;
        directionArray[_index3 + 4] = _v6.y - _v5.y;
        directionArray[_index3 + 5] = _v6.z - _v5.z;
      }
      bufferGeometry.setAttribute('control0', new THREE.BufferAttribute(controlArray0, 3, false));
      bufferGeometry.setAttribute('control1', new THREE.BufferAttribute(controlArray1, 3, false));
      bufferGeometry.setAttribute('direction', new THREE.BufferAttribute(directionArray, 3, false));
    }
    return object3d;
  }

  //
  var LDrawLoader = /*#__PURE__*/function (_THREE$Loader) {
    _inherits(LDrawLoader, _THREE$Loader);
    var _super3 = _createSuper(LDrawLoader);
    function LDrawLoader(manager) {
      var _this5;
      _classCallCheck(this, LDrawLoader);
      _this5 = _super3.call(this, manager);

      // Array of THREE.Material
      _this5.materials = [];
      _this5.materialLibrary = {};

      // This also allows to handle the embedded text files ("0 FILE" lines)
      _this5.partsCache = new LDrawPartsGeometryCache(_assertThisInitialized(_this5));

      // This object is a map from file names to paths. It agilizes the paths search. If it is not set then files will be searched by trial and error.
      _this5.fileMap = {};

      // Initializes the materials library with default materials
      _this5.setMaterials([]);

      // If this flag is set to true the vertex normals will be smoothed.
      _this5.smoothNormals = true;

      // The path to load parts from the LDraw parts library from.
      _this5.partsLibraryPath = '';

      // Material assigned to not available colors for meshes and edges
      _this5.missingColorMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF00FF,
        roughness: 0.3,
        metalness: 0
      });
      _this5.missingColorMaterial.name = 'Missing material';
      _this5.missingEdgeColorMaterial = new THREE.LineBasicMaterial({
        color: 0xFF00FF
      });
      _this5.missingEdgeColorMaterial.name = 'Missing material - Edge';
      _this5.missingConditionalEdgeColorMaterial = new LDrawConditionalLineMaterial({
        fog: true,
        color: 0xFF00FF
      });
      _this5.missingConditionalEdgeColorMaterial.name = 'Missing material - Conditional Edge';
      _this5.missingColorMaterial.userData.edgeMaterial = _this5.missingEdgeColorMaterial;
      _this5.missingEdgeColorMaterial.userData.conditionalEdgeMaterial = _this5.missingConditionalEdgeColorMaterial;
      return _this5;
    }
    _createClass(LDrawLoader, [{
      key: "setPartsLibraryPath",
      value: function setPartsLibraryPath(path) {
        this.partsLibraryPath = path;
        return this;
      }
    }, {
      key: "preloadMaterials",
      value: function () {
        var _preloadMaterials = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(url) {
          var fileLoader, text, colorLineRegex, lines, materials, i, l, line, directive, material;
          return _regeneratorRuntime().wrap(function _callee8$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                fileLoader = new THREE.FileLoader(this.manager);
                fileLoader.setPath(this.path);
                fileLoader.setRequestHeader(this.requestHeader);
                fileLoader.setWithCredentials(this.withCredentials);
                _context9.next = 6;
                return fileLoader.loadAsync(url);
              case 6:
                text = _context9.sent;
                colorLineRegex = /^0 !COLOUR/;
                lines = text.split(/[\n\r]/g);
                materials = [];
                for (i = 0, l = lines.length; i < l; i++) {
                  line = lines[i];
                  if (colorLineRegex.test(line)) {
                    directive = line.replace(colorLineRegex, '');
                    material = this.parseColorMetaDirective(new LineParser(directive));
                    materials.push(material);
                  }
                }
                this.setMaterials(materials);
              case 12:
              case "end":
                return _context9.stop();
            }
          }, _callee8, this);
        }));
        function preloadMaterials(_x8) {
          return _preloadMaterials.apply(this, arguments);
        }
        return preloadMaterials;
      }()
    }, {
      key: "load",
      value: function load(url, onLoad, onProgress, onError) {
        var _this6 = this;
        var fileLoader = new THREE.FileLoader(this.manager);
        fileLoader.setPath(this.path);
        fileLoader.setRequestHeader(this.requestHeader);
        fileLoader.setWithCredentials(this.withCredentials);
        fileLoader.load(url, function (text) {
          _this6.partsCache.parseModel(text, _this6.materialLibrary).then(function (group) {
            _this6.applyMaterialsToMesh(group, MAIN_COLOUR_CODE, _this6.materialLibrary, true);
            _this6.computeBuildingSteps(group);
            group.userData.fileName = url;
            onLoad(group);
          })["catch"](onError);
        }, onProgress, onError);
      }
    }, {
      key: "parse",
      value: function parse(text, onLoad) {
        var _this7 = this;
        this.partsCache.parseModel(text, this.materialLibrary).then(function (group) {
          _this7.applyMaterialsToMesh(group, MAIN_COLOUR_CODE, _this7.materialLibrary, true);
          _this7.computeBuildingSteps(group);
          group.userData.fileName = '';
          onLoad(group);
        });
      }
    }, {
      key: "setMaterials",
      value: function setMaterials(materials) {
        this.materialLibrary = {};
        this.materials = [];
        for (var i = 0, l = materials.length; i < l; i++) {
          this.addMaterial(materials[i]);
        }

        // Add default main triangle and line edge materials (used in pieces that can be colored with a main color)
        this.addMaterial(this.parseColorMetaDirective(new LineParser('Main_Colour CODE 16 VALUE #FF8080 EDGE #333333')));
        this.addMaterial(this.parseColorMetaDirective(new LineParser('Edge_Colour CODE 24 VALUE #A0A0A0 EDGE #333333')));
        return this;
      }
    }, {
      key: "setFileMap",
      value: function setFileMap(fileMap) {
        this.fileMap = fileMap;
        return this;
      }
    }, {
      key: "addMaterial",
      value: function addMaterial(material) {
        // Adds a material to the material library which is on top of the parse scopes stack. And also to the materials array

        var matLib = this.materialLibrary;
        if (!matLib[material.userData.code]) {
          this.materials.push(material);
          matLib[material.userData.code] = material;
        }
        return this;
      }
    }, {
      key: "getMaterial",
      value: function getMaterial(colorCode) {
        if (colorCode.startsWith('0x2')) {
          // Special 'direct' material value (RGB color)
          var color = colorCode.substring(3);
          return this.parseColorMetaDirective(new LineParser('Direct_Color_' + color + ' CODE -1 VALUE #' + color + ' EDGE #' + color + ''));
        }
        return this.materialLibrary[colorCode] || null;
      }

      // Applies the appropriate materials to a prebuilt hierarchy of geometry. Assumes that color codes are present
      // in the material array if they need to be filled in.
    }, {
      key: "applyMaterialsToMesh",
      value: function applyMaterialsToMesh(group, parentColorCode, materialHierarchy) {
        var finalMaterialPass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        // find any missing materials as indicated by a color code string and replace it with a material from the current material lib
        var loader = this;
        var parentIsPassthrough = parentColorCode === MAIN_COLOUR_CODE;
        group.traverse(function (c) {
          if (c.isMesh || c.isLineSegments) {
            if (Array.isArray(c.material)) {
              for (var i = 0, l = c.material.length; i < l; i++) {
                if (!c.material[i].isMaterial) {
                  c.material[i] = getMaterial(c, c.material[i]);
                }
              }
            } else if (!c.material.isMaterial) {
              c.material = getMaterial(c, c.material);
            }
          }
        });

        // Returns the appropriate material for the object (line or face) given color code. If the code is "pass through"
        // (24 for lines, 16 for edges) then the pass through color code is used. If that is also pass through then it's
        // simply returned for the subsequent material application.
        function getMaterial(c, colorCode) {
          // if our parent is a passthrough color code and we don't have the current material color available then
          // return early.
          if (parentIsPassthrough && !(colorCode in materialHierarchy) && !finalMaterialPass) {
            return colorCode;
          }
          var forEdge = c.isLineSegments || c.isConditionalLine;
          var isPassthrough = !forEdge && colorCode === MAIN_COLOUR_CODE || forEdge && colorCode === MAIN_EDGE_COLOUR_CODE;
          if (isPassthrough) {
            colorCode = parentColorCode;
          }
          var material = null;
          if (colorCode in materialHierarchy) {
            material = materialHierarchy[colorCode];
          } else if (finalMaterialPass) {
            // see if we can get the final material from from the "getMaterial" function which will attempt to
            // parse the "direct" colors
            material = loader.getMaterial(colorCode);
            if (material === null) {
              // otherwise throw a warning if this is final opportunity to set the material
              console.warn("LDrawLoader: Material properties for code ".concat(colorCode, " not available."));

              // And return the 'missing color' material
              material = loader.missingColorMaterial;
            }
          } else {
            return colorCode;
          }
          if (c.isLineSegments) {
            material = material.userData.edgeMaterial;
            if (c.isConditionalLine) {
              material = material.userData.conditionalEdgeMaterial;
            }
          }
          return material;
        }
      }
    }, {
      key: "getMainMaterial",
      value: function getMainMaterial() {
        return this.getMaterial(MAIN_COLOUR_CODE);
      }
    }, {
      key: "getMainEdgeMaterial",
      value: function getMainEdgeMaterial() {
        var mat = this.getMaterial(MAIN_EDGE_COLOUR_CODE);
        return mat ? mat.userData.edgeMaterial : null;
      }
    }, {
      key: "parseColorMetaDirective",
      value: function parseColorMetaDirective(lineParser) {
        // Parses a color definition and returns a THREE.Material

        var code = null;

        // Triangle and line colors
        var color = 0xFF00FF;
        var edgeColor = 0xFF00FF;

        // Transparency
        var alpha = 1;
        var isTransparent = false;
        // Self-illumination:
        var luminance = 0;
        var finishType = FINISH_TYPE_DEFAULT;
        var edgeMaterial = null;
        var name = lineParser.getToken();
        if (!name) {
          throw new Error('LDrawLoader: Material name was expected after "!COLOUR tag' + lineParser.getLineNumberString() + '.');
        }

        // Parse tag tokens and their parameters
        var token = null;
        while (true) {
          token = lineParser.getToken();
          if (!token) {
            break;
          }
          if (!parseLuminance(token)) {
            switch (token.toUpperCase()) {
              case 'CODE':
                code = lineParser.getToken();
                break;
              case 'VALUE':
                color = lineParser.getToken();
                if (color.startsWith('0x')) {
                  color = '#' + color.substring(2);
                } else if (!color.startsWith('#')) {
                  throw new Error('LDrawLoader: Invalid color while parsing material' + lineParser.getLineNumberString() + '.');
                }
                break;
              case 'EDGE':
                edgeColor = lineParser.getToken();
                if (edgeColor.startsWith('0x')) {
                  edgeColor = '#' + edgeColor.substring(2);
                } else if (!edgeColor.startsWith('#')) {
                  // Try to see if edge color is a color code
                  edgeMaterial = this.getMaterial(edgeColor);
                  if (!edgeMaterial) {
                    throw new Error('LDrawLoader: Invalid edge color while parsing material' + lineParser.getLineNumberString() + '.');
                  }

                  // Get the edge material for this triangle material
                  edgeMaterial = edgeMaterial.userData.edgeMaterial;
                }
                break;
              case 'ALPHA':
                alpha = parseInt(lineParser.getToken());
                if (isNaN(alpha)) {
                  throw new Error('LDrawLoader: Invalid alpha value in material definition' + lineParser.getLineNumberString() + '.');
                }
                alpha = Math.max(0, Math.min(1, alpha / 255));
                if (alpha < 1) {
                  isTransparent = true;
                }
                break;
              case 'LUMINANCE':
                if (!parseLuminance(lineParser.getToken())) {
                  throw new Error('LDrawLoader: Invalid luminance value in material definition' + LineParser.getLineNumberString() + '.');
                }
                break;
              case 'CHROME':
                finishType = FINISH_TYPE_CHROME;
                break;
              case 'PEARLESCENT':
                finishType = FINISH_TYPE_PEARLESCENT;
                break;
              case 'RUBBER':
                finishType = FINISH_TYPE_RUBBER;
                break;
              case 'MATTE_METALLIC':
                finishType = FINISH_TYPE_MATTE_METALLIC;
                break;
              case 'METAL':
                finishType = FINISH_TYPE_METAL;
                break;
              case 'MATERIAL':
                // Not implemented
                lineParser.setToEnd();
                break;
              default:
                throw new Error('LDrawLoader: Unknown token "' + token + '" while parsing material' + lineParser.getLineNumberString() + '.');
            }
          }
        }
        var material = null;
        switch (finishType) {
          case FINISH_TYPE_DEFAULT:
            material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0.3,
              metalness: 0
            });
            break;
          case FINISH_TYPE_PEARLESCENT:
            // Try to imitate pearlescency by making the surface glossy
            material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0.3,
              metalness: 0.25
            });
            break;
          case FINISH_TYPE_CHROME:
            // Mirror finish surface
            material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0,
              metalness: 1
            });
            break;
          case FINISH_TYPE_RUBBER:
            // Rubber finish
            material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0.9,
              metalness: 0
            });
            break;
          case FINISH_TYPE_MATTE_METALLIC:
            // Brushed metal finish
            material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0.8,
              metalness: 0.4
            });
            break;
          case FINISH_TYPE_METAL:
            // Average metal finish
            material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0.2,
              metalness: 0.85
            });
            break;
          default:
            // Should not happen
            break;
        }
        material.transparent = isTransparent;
        material.premultipliedAlpha = true;
        material.opacity = alpha;
        material.depthWrite = !isTransparent;
        material.color.convertSRGBToLinear();
        material.polygonOffset = true;
        material.polygonOffsetFactor = 1;
        if (luminance !== 0) {
          material.emissive.set(material.color).multiplyScalar(luminance);
        }
        if (!edgeMaterial) {
          // This is the material used for edges
          edgeMaterial = new THREE.LineBasicMaterial({
            color: edgeColor,
            transparent: isTransparent,
            opacity: alpha,
            depthWrite: !isTransparent
          });
          edgeMaterial.userData.code = code;
          edgeMaterial.name = name + ' - Edge';
          edgeMaterial.color.convertSRGBToLinear();

          // This is the material used for conditional edges
          edgeMaterial.userData.conditionalEdgeMaterial = new LDrawConditionalLineMaterial({
            fog: true,
            transparent: isTransparent,
            depthWrite: !isTransparent,
            color: edgeColor,
            opacity: alpha
          });
          edgeMaterial.userData.conditionalEdgeMaterial.color.convertSRGBToLinear();
          edgeMaterial.userData.conditionalEdgeMaterial.userData.code = code;
          edgeMaterial.userData.conditionalEdgeMaterial.name = name + ' - Conditional Edge';
        }
        material.userData.code = code;
        material.name = name;
        material.userData.edgeMaterial = edgeMaterial;
        this.addMaterial(material);
        return material;
        function parseLuminance(token) {
          // Returns success

          var lum;
          if (token.startsWith('LUMINANCE')) {
            lum = parseInt(token.substring(9));
          } else {
            lum = parseInt(token);
          }
          if (isNaN(lum)) {
            return false;
          }
          luminance = Math.max(0, Math.min(1, lum / 255));
          return true;
        }
      }
    }, {
      key: "computeBuildingSteps",
      value: function computeBuildingSteps(model) {
        // Sets userdata.buildingStep number in THREE.Group objects and userData.numBuildingSteps number in the root THREE.Group object.

        var stepNumber = 0;
        model.traverse(function (c) {
          if (c.isGroup) {
            if (c.userData.startingBuildingStep) {
              stepNumber++;
            }
            c.userData.buildingStep = stepNumber;
          }
        });
        model.userData.numBuildingSteps = stepNumber + 1;
      }
    }]);
    return LDrawLoader;
  }(THREE.Loader);
  THREE.LDrawLoader = LDrawLoader;
})();