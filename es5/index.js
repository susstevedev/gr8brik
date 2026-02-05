"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _this2 = void 0;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/* The mess that runs the entire modeler */

// !!! WILL BREAK THINGS !!!
// Used for debugging sometimes

//'use strict';

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});
var partColor = "#C91A09";
var start_url = 'https://gr8brik.rf.gd';
$(document).ready(function () {
  $("#color-picker").spectrum({
    color: partColor,
    preferredFormat: "hex",
    showInput: true,
    showPalette: true,
    maxSelectionSize: 4,
    palette: [["#C91A09",
    // Bright Red
    "#F8CC00",
    // Bright Yellow
    "#0020A0",
    // Bright Blue
    "#005700",
    // Dark Green
    "#FE8A18",
    // Bright Orange
    "#D941BB" // Bright Violet
    ], ["#000000",
    // Black
    "#FFFFFF",
    // White
    "#747371",
    // Dark Stone Grey (Dark Bluish Grey)
    "#A3A2A4",
    // Medium Stone Grey (Light Bluish Grey)
    "#958A73",
    // Dark Tan (Brick Yellow)
    "#6C5C4D" // Brown
    ], ["#812A00",
    // Dark Brown
    "#5883C1",
    // Medium Blue
    "#4B974B",
    // Sand Green
    "#A52A2A",
    // Dark Red
    "#B36D2C",
    // Dark Orange
    "#FCB7BC" // Bright Pink
    ], ["#60C0E0",
    // Bright Light Blue
    "#FBE696",
    // Earth Yellow (Light Yellow)
    "#84B68D",
    // Bright Green
    "#92B28B",
    // Lime Green
    "#002A5A",
    // Dark Blue
    "#DDDD22" // Vibrant Yellow
    ]],

    change: function change(color) {
      console.log("Changed selected color to ".concat(color.toName() || color.toHexString()));
      partColor = color.toHexString();
      if (color && selectedObject) {
        changeBlockColor(color.toHexString());
      }
    }
  });
});

// fix links not working
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A') {
    event.preventDefault();
    var url = event.target.getAttribute("href");
    if (event.target.hasAttribute("download")) return;
    if (url && /^https?:\/\//.test(url)) {
      window.location.href = url;
    }
  }
});

// user login function
// todo have this run ever 10 seconds if user is not signed in
function login() {
  fetch(start_url + "/ajax/user.php?ajax=true")
  //fetch('user.json')
  .then(function (res) {
    return res.json();
  }).then(function (response) {
    if (response.success) {
      var _response$user, _response$pfp;
      var field = document.getElementById("username-field");
      field.innerText = response.user;
      field.setAttribute("href", "/acc/creations");
      tooltip('Logged in as ' + response.user);
      ui_login((_response$user = response.user) !== null && _response$user !== void 0 ? _response$user : 'Guest User', (_response$pfp = response.pfp) !== null && _response$pfp !== void 0 ? _response$pfp : 'img/logo.png');
    }
  })["catch"]( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(err) {
      var res;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return err.response.json();
          case 3:
            res = _context.sent;
            tooltip(res.error);
            console.error("An error occured while authenticating " + res.error);
            ui_login('Guest User', 'img/logo.png');
            _context.next = 14;
            break;
          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            tooltip('An error occured while authenticating');
            ui_login('Guest User', 'img/logo.png');
            console.error("An error occured while authenticating " + err);
          case 14:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 9]]);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}
login();

/* UI auth */
function ui_login(username, pfp) {
  document.querySelector('#settings-account-auth-username').textContent = username;
  document.querySelector('#settings-account-auth-pfp').src = pfp;
}
var displayed_parts = [];
var current_type = '';
var cached_parts = {};

// load parts from url
function loadParts(type) {
  console.log("loading ".concat(type, " category"));
  current_type = type;
  if (cached_parts[type]) {
    console.log("".concat(type, " parts loaded from cache"));
    displayed_parts = cached_parts[type];
    displayParts();
    return;
  }
  fetch("https://susstevedev.github.io/gr8brik/parts/".concat(type, ".json")).then(function (res) {
    return res.json();
  }).then(function (data) {
    console.log("".concat(type, " parts loaded"));
    displayed_parts = data;
    cached_parts[type] = data;
    displayParts();
  })["catch"](function (err) {
    console.error('error loading parts ', err);
    tooltip('Failed to load parts');
  });
}

// display parts function
function displayParts() {
  var container = document.getElementById("select-block");
  container.innerHTML = '';
  displayed_parts = displayed_parts.sort(function (a, b) {
    return a.name.length - b.name.length;
  });
  displayed_parts.forEach(function (part) {
    var span = document.createElement("span");
    span.id = part.file;
    span.title = part.name;
    span.setAttribute("value", part.file);
    span.innerHTML = "\n\t\t\t\t\t<img src=\"https://library.ldraw.org/media/ldraw/official/parts/".concat(part.file.split(".")[0], ".png\" loading=\"lazy\" width=\"45px\" />\n\t\t\t\t\t<br />\n\t\t\t\t\t<small class=\"part-list-number\">").concat(part.file.split(".")[0], "</small>\n\t\t\t\t\t&nbsp;\n\t\t\t\t\t<!-- <small class=\"hover-only\">").concat(part.name, "</small> -->\n\t\t\t\t");
    container.appendChild(span);
  });
}
loadParts('brick');

/*document.getElementById("search-parts").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        const value = this.value.toLowerCase().replace(/\s+/g, " ").trim();
        const items = Array.from(document.querySelectorAll("#select-block span"));

        items.forEach(item => {
            //const text = item.textContent.toLowerCase().replace(/\s+/g, " ").trim();
  const text = (item.title || "").toLowerCase().replace(/\s+/g, " ").trim();
            item.style.display = text.includes(value) ? 'flex' : 'none';
        });
    }
}); */

/*document.getElementById("search-parts").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const value = this.value.toLowerCase().replace(/\s+/g, " ").trim();
    const items = Array.from(document.querySelectorAll("#select-block span"));

    items.forEach(item => {
      const titleText = (item.title || "").toLowerCase().replace(/\s+/g, " ").trim();
      const smallTextEl = item.querySelector("small.part-list-number");
      const smallText = smallTextEl ? smallTextEl.textContent.toLowerCase().trim() : "";

      const matches = titleText.includes(value) || smallText.includes(value);
      item.style.display = matches ? "flex" : "none";
    });
  }
}); */

// New search function
// This will be slightly slower though as it stores an array of simi matching parts and exact matches for those parts, then goes through them and pushes the exact maches to the top
document.getElementById("search-parts").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    var value = this.value.toLowerCase().replace(/\s+/g, " ").trim();
    var items = Array.from(document.querySelectorAll("#select-block span"));
    var exact_match = [];
    var simi_match = [];
    items.forEach(function (item) {
      var title_txt = (item.title || "").toLowerCase().replace(/\s+/g, " ").trim();
      var part_num_elm = item.querySelector("small.part-list-number");
      var small_txt = part_num_elm ? part_num_elm.textContent.toLowerCase().trim() : "";
      var exact = title_txt === value || small_txt === value;
      var simi = title_txt.includes(value) || small_txt.includes(value);
      if (exact) {
        exact_match.push(item);
      } else if (simi) {
        simi_match.push(item);
      } else {
        item.style.display = "none";
      }
    });
    var _container = document.getElementById("select-block");
    exact_match.concat(simi_match).forEach(function (item) {
      item.style.display = "flex";
      _container.appendChild(item);
    });
  }
});

// add a new part
document.getElementById("select-block").addEventListener("click", function (e) {
  var span = e.target.closest("span");
  var original_img = span.querySelector('img').getAttribute("src");
  span.querySelector('img').setAttribute("src", "img/load.gif");
  if (!span) {
    return;
  }
  var selectedPart = span.getAttribute("value");
  if (!selectedPart) {
    return;
  }
  part = 'parts/' + selectedPart;
  partName = selectedPart;
  addBlockV2(part, partColor, partPosition, partRotation, span, original_img, part, null, null);
});

// list for items that are already in the scene
document.querySelector("#block-list").addEventListener("click", function (e) {
  if (e.target.matches(".scene-block-item")) {
    var id = e.target.getAttribute("data-id");
    var obj = scene.getObjectByProperty('uuid', id);
    if (obj) {
      transformControls.detach(selectedObject);
      selectedObject = null;
      transformControls.attach(obj);
      selectedObject = obj;
      tooltip('Part selected');
    }
  }
});

// save creation
document.getElementById("download-json").addEventListener("click", function () {
  var _this = this;
  var sceneJSON = generateSceneJSON();
  if (sceneJSON) {
    autosave();
    if (selectedObject) {
      transformControls.detach(selectedObject);
      selectedObject = null;
    }
    var name = document.querySelector("#save-popup input[name='name']").value.trim();
    var desc = document.querySelector("#save-popup textarea[name='desc']").value.trim();
    var screenshot = capture();
    this.innerHTML = "<i class=\"fa fa-spinner fa-spin\" aria-hidden=\"true\"></i>";
    fetch(start_url + "/ajax/build.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        save_build: true,
        creation: sceneJSON,
        name: name,
        desc: desc,
        screenshot: screenshot
      })
    }).then(function (res) {
      return res.json();
    }).then(function (response) {
      tooltip(response.success);
      _this.innerText = "Save Creation";
      //this.disabled = true;
    })["catch"]( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(err) {
        var res;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return err.response.json();
            case 3:
              res = _context2.sent;
              tooltip(res.error);
              _this.innerText = "Try again";
              _context2.next = 12;
              break;
            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              tooltip("An unknown error occurred.");
              _this.innerText = "Try again";
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 8]]);
      }));
      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  } else {
    tooltip('Problem while generating scene');
  }
});

// import modal
document.getElementById("import-finish").addEventListener("click", function () {
  var format = document.getElementById("import-format").value;
  if (format === "cloud") {
    tooltip('GR8BRIK models from your account cannot be imported yet.');
    return;
  }
  if (format === "three") {
    document.getElementById("cre-import-three").click();
  }
  if (format === "json") {
    document.getElementById("cre-import").click();
  }
  if (format === "lxf") {
    document.getElementById("cre-export-ldd").click();
  }
  if (format === "ldr") {
    document.getElementById("cre-import-ldr").click();
  }
});

// export model
document.getElementById("export-finish").addEventListener("click", function () {
  var format = document.getElementById("export-format").value;
  selectedExport = document.getElementById("export-format").value;
  if (format === "three") {
    document.getElementById("cre-export-three").click();
  }
  if (format === "selectedobj") {
    document.getElementById("selected-object-export-three").click();
  }
  if (format === "json") {
    document.getElementById("cre-export").click();
  }
  if (format === "gr8") {
    document.getElementById("cre-export-gr8").click();
  }
  if (format === "lxf") {
    document.getElementById("cre-export-ldd").click();
  }
  if (format === "dae") {
    var collada = new THREE.ColladaExporter();
    var collada_data = collada.parse(filter_objects_peices());
    var blob = new Blob([collada_data.data], {
      type: 'model/vnd.collada+xml'
    });
    var url = URL.createObjectURL(blob);
    var date = getDate();
    var a = document.createElement('a');
    a.href = url;
    a.download = "collada-".concat(date, ".dae");
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 10000);
  }

  // gltfexporter is async
  if (format === "glb") {
    var exporter = new THREE.GLTFExporter();
    var _date = getDate();
    var _scene = filter_objects_peices();
    console.log(_scene.children.length, "meshes to export");
    exporter.parse(_scene, function (result) {
      //const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      var blob = new Blob([result], {
        type: 'model/gltf-binary'
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = "creation-".concat(_date, ".glb");
      a.click();
      setTimeout(function () {
        return URL.revokeObjectURL(url);
      }, 10000);
    }, {
      binary: true,
      onlyVisible: true,
      embedImages: true,
      forceIndices: true,
      forcePowerOfTwoTextures: true
    });
  }
  if (format === "obj") {
    var _exporter = new THREE.OBJExporter();
    var _date2 = getDate();
    var result = _exporter.parse(filter_objects_peices());
    var _blob = new Blob([result], {
      type: 'text/plain'
    });
    var _url = URL.createObjectURL(_blob);
    var _a = document.createElement('a');
    _a.href = _url;
    _a.download = "obj-mtl-".concat(_date2, ".obj");
    _a.click();
    setTimeout(function () {
      return URL.revokeObjectURL(_url);
    }, 10000);
  }
  if (format === "mpd") {
    exportSceneToMPD("creation");
  }
});
document.getElementById("part-type-filter").addEventListener("change", function () {
  loadParts(this.value);
});

// save to cloud menu open and close

document.getElementById("save-popup-open").addEventListener("click", function () {
  document.getElementById("save-popup").style.display = "block";
});
document.querySelector("#save-popup .btn-alt").addEventListener("click", function () {
  document.getElementById("save-popup").style.display = "none";
});

// import popup open and close
document.getElementById("import-popup-open").addEventListener("click", function () {
  document.getElementById("import-popup").style.display = "block";
});
document.querySelector("#import-popup .btn-alt").addEventListener("click", function () {
  document.getElementById("import-popup").style.display = "none";
});

// export popup open and close
document.getElementById("export-popup-open").addEventListener("click", function () {
  document.getElementById("export-popup").style.display = "block";
});
document.querySelector("#export-popup .btn-alt").addEventListener("click", function () {
  document.getElementById("export-popup").style.display = "none";
});

// settings popup open and close
document.getElementById("settings-popup-open").addEventListener("click", function () {
  document.getElementById("settings-popup").style.display = "block";
  /*
  let elm = document.getElementById("settings-popup");
  elm.style.display = (elm.style.display === "none") ? "block" : "none";
  */
});

document.querySelector("#settings-popup .btn-alt").addEventListener("click", function () {
  document.getElementById("settings-popup").style.display = "none";
});

/* Welcome popup */
document.querySelector("#welcome-popup .btn-alt").addEventListener("click", function () {
  document.getElementById("welcome-popup").style.display = "none";
});
document.querySelector("#welcome-popup .close.btn").addEventListener("click", function () {
  document.getElementById("welcome-popup").style.display = "none";
});

/* Other */

document.getElementById("clear_autosave").addEventListener("click", function () {
  clear_autosave();
});
document.getElementById("read_autosave").addEventListener("click", function () {
  read_autosave();
});
document.getElementById("clear_settings").addEventListener("click", function () {
  clear_settings();
});
document.getElementById("read_settings").addEventListener("click", function () {
  read_settings();
});

// file menu
document.querySelector("#menu-file").addEventListener("click", function () {
  var elm = document.getElementById("dropdown-file");
  //elm.style.display = (elm.style.display === "none") ? "block" : "none";

  // i dont like how shorthand looks
  if (elm.style.display === "block") {
    elm.style.display = "none";
  } else {
    elm.style.display = "block";
  }
});
document.querySelector("#menu-edit").addEventListener("click", function () {
  var elm = document.getElementById("dropdown-edit");
  if (elm.style.display === "block") {
    elm.style.display = "none";
  } else {
    elm.style.display = "block";
  }
});
var studSize = 1000;
var partList = document.getElementById('blk');
var colList = document.getElementById('select-color');

/*document.getElementById("username-field").addEventListener("click", function () {
    var content = document.getElementById("username-content");
    if (content.style.display === "block" || content.style.display === "") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
});*/

document.getElementById("color-picker").addEventListener("click", function () {
  console.log("color picker clicked");
});
document.getElementById("duplicate-part").addEventListener("click", function () {
  if (selectedObject) {
    duplicatePart();
  }
});
document.getElementById("selected-map").addEventListener("input", function () {
  console.log("Selected material number is ".concat(this.value));
  selectedMap = this.value;
});
document.getElementById("delete-block").addEventListener("click", function () {
  deleteBlock(selectedObject);
});
document.getElementById("takeScreenshot").addEventListener("click", function () {
  var url = capture();
  var date = new Date();
  var a = document.createElement("a");
  a.href = url;
  a.download = "creation-screenshot-".concat(date, ".webp");
  a.click();
});
document.getElementById("toggleMenu").addEventListener("click", function () {
  var left = document.getElementById("left-container");
  if (left.style.left === "0px" || left.style.left === "") {
    left.style.left = "-999px";
  } else {
    left.style.left = "0px";
  }
});
document.querySelectorAll('.tab-button').forEach(function (button) {
  button.addEventListener('click', function () {
    var is1 = this.id === 'tab1';
    var search = document.getElementById("search-parts");
    document.getElementById('select-block').style.display = is1 ? 'flex' : 'none';
    document.getElementById('block-list').style.display = is1 ? 'none' : 'block';
    search.readOnly = is1 ? false : true;
  });
});
document.getElementById("cre-export").addEventListener("click", function () {
  var jsonData = generateSceneJSON();
  var jsonBlob = new Blob([jsonData], {
    type: "application/json"
  });
  var elm = _this2;
  var url = URL.createObjectURL(jsonBlob);
  var date = getDate();
  var a = document.createElement("a");
  a.href = url;
  a.download = "json-creation-".concat(date, ".json");
  a.click();
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 10000);
});
document.getElementById("cre-export-gr8").addEventListener("click", function () {
  var fileData = generateSceneJSON();
  var dataBlob = new Blob([fileData], {
    type: "application/json"
  });
  var elm = _this2;
  var url = URL.createObjectURL(dataBlob);
  var date = getDate();
  var a = document.createElement("a");
  a.href = url;
  a.download = "gr8brik-creation-".concat(date, ".gr8");
  a.click();
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 10000);
});
document.getElementById("cre-export-ldd").addEventListener("click", function () {
  console.log('clicked');
  var legoData = generateSceneLXFML();
  var zip = new JSZip();
  zip.file("IMAGE100.LXFML", legoData);
  var elm = _this2;
  zip.generateAsync({
    type: "blob"
  }).then(function (blob) {
    var url = URL.createObjectURL(blob);
    var date = getDate();
    var a = document.createElement("a");
    a.href = url;
    a.download = "ldd-creation-".concat(date, ".lxf");
    a.click();
    URL.revokeObjectURL(url);
  });
});
document.getElementById("cre-export-three").addEventListener("click", function () {
  if (!scene) {
    tooltip("Scene is empty");
    return;
  }
  var date = getDate();
  var json = scene.toJSON();
  var jsonString = JSON.stringify(json);
  var blob = new Blob([jsonString], {
    type: "application/json"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "threejs-".concat(date, ".json");
  a.click();
  URL.revokeObjectURL(url);
});
document.getElementById("selected-object-export-three").addEventListener("click", function () {
  if (!scene) {
    tooltip("Scene is empty");
    return;
  }
  if (!selectedObject || !selectedObject.geometry) {
    tooltip("Please select an object");
  }
  var name = selectedObject.userData.ldraw.replace("parts/", "");
  var date = getDate();
  var json = selectedObject.geometry.toJSON();
  var jsonString = JSON.stringify(json);
  var blob = new Blob([jsonString], {
    type: "application/json"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "".concat(name, "-").concat(date, ".json");
  a.click();
  URL.revokeObjectURL(url);
});

/* function exportSceneToMPD(name) {
    const lines = [];

    const ldraw_color_map = {
    "C91A09": 4, // Bright Red
    "F8CC00": 14, // Bright Yellow
    "0020A0": 12, // Bright Blue
    "005700": 28, // Dark Green
    "FE8A18": 10, // Bright Orange
    "D941BB": 124, // Bright Violet / Dark Purple

    "000000": 0, // Black
    "FFFFFF": 15, // White
    "747371": 294, // Dark Stone Grey / Dark Bluish Grey
    "A3A2A4": 295, // Medium Stone Grey / Light Bluish Grey
    "958A73": 5, // Brick Yellow / Tan
    "6C5C4D": 8, // Dark Stone Grey / Dark Brown

    "812A00": 308, // Reddish Brown
    "5883C1": 23, // Medium Blue
    "4B974B": 37, // Sand Green
    "A52A2A": 59, // Dark Red
    "B36D2C": 38, // Dark Orange
    "FCB7BC": 223, // Bright Pink

    "60C0E0": 212, // Bright Light Blue
    "FBE696": 226, // Light Yellow
    "84B68D": 36, // Bright Green
    "92B28B": 335, // Bright Yellowish Green / Lime
    "002A5A": 26, // Dark Blue
    "DDDD22": 334, // Vibrant Yellow
    };

    lines.push(`0 FILE ${name}.ldr`);
    lines.push(`0 ${name}`);
    lines.push(`0 Name: ${name}.ldr`);
    lines.push(`0 Author: Exported from Three.js`);
    lines.push(`0 !LDRAW_ORG Model`);
    lines.push(`0 !LICENSE Redistributable under CCAL version 2.0`);
    lines.push(`0`);

    scene.updateMatrixWorld(true);

    scene.traverse(child => {
    if (!child.isMesh || !child.userData.ldraw || !child.userData.isBlock) {
        return;
    }

    const obj = child.clone();
    obj.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1));
    obj.updateMatrixWorld(true);

    let color_code = 16;
    if(obj.material && !Array.isArray(obj.material)) {
        const hex = obj.material.color.getHexString() || "ffffff";
        color_code = ldraw_color_map[hex.toUpperCase()];
    }

    const file = obj.userData.ldraw.replace("parts/", "");
    const color = color_code;

    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    obj.matrixWorld.decompose(pos, quat, scale);

    /* const matrix = new THREE.Matrix3().setFromMatrix4(obj.matrixWorld);

    const e = matrix.elements;

    const rot = e;
    const x = pos.x;
    const y = pos.y;
    const z = pos.z; */

//const scaleFactor = 1000 / 0.4;

//const matrix = new THREE.Matrix3().setFromMatrix4(obj.matrixWorld);
//const rot = matrix.elements.map(n => n.toFixed(5));
//const e = matrix.elements;

//const e = obj.matrixWorld.elements; */

/*const rot = [
    e[0], e[4], e[8],  e[12] * scaleFactor,
    e[1], e[5], e[9],  e[13] * scaleFactor,
    e[2], e[6], e[10], e[14] * scaleFactor,
].map(n => n.toFixed(5)); */

/* const x = (pos.x * scaleFactor).toFixed(2);
const y = (pos.y * scaleFactor).toFixed(2);
const z = (pos.z * scaleFactor).toFixed(2); */

//const line = `1 ${color} ${x} ${y} ${z} ${rot.join(' ')} ${file}`;
//const line = `1 ${color} ${rot.join(' ')} ${file}`;

// const rot = [
// e[0], e[4], e[8],  e[12],
//  e[1], e[5], e[9],  e[13],
//   e[2], e[6], e[10], e[14],
// ].map(n => n.toFixed(5));

// const line = `1 ${color} ${rot[3]} ${rot[7]} ${rot[11]} ${rot[0]} ${rot[1]} ${rot[2]} ${rot[4]} ${rot[5]} ${rot[6]} ${rot[8]} ${rot[9]} ${rot[10]} ${file}`;

//const x = (e[12] * scaleFactor).toFixed(2);
//const y = (e[13] * scaleFactor).toFixed(2);
//const z = (-e[14] * scaleFactor).toFixed(2);

// const a = e[0].toFixed(5), b = e[4].toFixed(5), c = e[8].toFixed(5);
//  const d = e[1].toFixed(5), e2 = e[5].toFixed(5), f = e[9].toFixed(5);
// const g = e[2].toFixed(5), h = e[6].toFixed(5), i = e[10].toFixed(5);

// const line = `1 ${color} ${x} ${y} ${z} ${a} ${b} ${c} ${d} ${e2} ${f} ${g} ${h} ${i} ${file}`;
//lines.push(line);
/* }); */

/* let result =  lines.join('\n');
const date = getDate();

const blob = new Blob([result], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `creation-${date}.mpd`;
a.click();

setTimeout(() => URL.revokeObjectURL(url), 10000);
} */

function exportSceneToMPD(name) {
  var lines = [];

  /*const ldraw_color_map = {
  "C91A09": 4, // Bright Red
  "F8CC00": 14, // Bright Yellow
  "0020A0": 12, // Bright Blue
  "005700": 28, // Dark Green
  "FE8A18": 10, // Bright Orange
  "D941BB": 124, // Bright Violet / Dark Purple
   "000000": 0, // Black
  "FFFFFF": 15, // White
  "747371": 294, // Dark Stone Grey / Dark Bluish Grey
  "A3A2A4": 295, // Medium Stone Grey / Light Bluish Grey
  "958A73": 5, // Brick Yellow / Tan
  "6C5C4D": 8, // Dark Stone Grey / Dark Brown
   "812A00": 308, // Reddish Brown
  "5883C1": 23, // Medium Blue
  "4B974B": 37, // Sand Green
  "A52A2A": 59, // Dark Red
  "B36D2C": 38, // Dark Orange
  "FCB7BC": 223, // Bright Pink
   "60C0E0": 212, // Bright Light Blue
  "FBE696": 226, // Light Yellow
  "84B68D": 36, // Bright Green
  "92B28B": 335, // Bright Yellowish Green / Lime
  "002A5A": 26, // Dark Blue
  "DDDD22": 334, // Vibrant Yellow
  }; */

  var ldraw_color_map = {
    // row 1
    "C91A09": 4,
    // Bright Red
    "F8CC00": 14,
    // Bright Yellow
    "0020A0": 12,
    // Bright Blue
    "005700": 28,
    // Dark Green
    "FE8A18": 10,
    // Bright Orange
    "D941BB": 124,
    // Bright Violet

    // row 2
    "000000": 0,
    // Black
    "FFFFFF": 15,
    // White
    "747371": 294,
    // Dark Stone Grey
    "A3A2A4": 295,
    // Medium Stone Grey
    "958A73": 5,
    // Dark Tan
    "6C5C4D": 8,
    // Brown

    // row 3
    "812A00": 308,
    // Dark Brown
    "5883C1": 23,
    // Medium Blue
    "4B974B": 37,
    // Sand Green
    "A52A2A": 59,
    // Dark Red
    "B36D2C": 38,
    // Dark Orange
    "FCB7BC": 223,
    // Bright Pink

    // row 4
    "60C0E0": 212,
    // Bright Light Blue
    "FBE696": 226,
    // Earth Yellow
    "84B68D": 36,
    // Bright Green
    "92B28B": 335,
    // Lime Green
    "002A5A": 26,
    // Dark Blue
    "DDDD22": 334 // Vibrant Yellow
  };

  lines.push("0 FILE ".concat(name, ".ldr"));
  lines.push("0 ".concat(name));
  lines.push("0 Name: ".concat(name, ".ldr"));
  lines.push("0 Author: Exported from Three.js");
  lines.push("0 !LDRAW_ORG Model");
  lines.push("0 !LICENSE Redistributable under CCAL version 2.0");
  lines.push("0");

  /*scene.updateMatrixWorld(true);
   scene.traverse(child => {
  if (!child.isMesh || !child.userData.ldraw || !child.userData.isBlock) {
      return;
  }
   const obj = child.clone();
  obj.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1));
  obj.updateMatrixWorld(true);
   let color_code = 16;
  if(obj.material && !Array.isArray(obj.material)) {
      const hex = obj.material.color.getHexString() || "ffffff";
      color_code = ldraw_color_map[hex.toUpperCase()];
  }
   const file = obj.userData.ldraw.replace("parts/", "");
  const color = color_code;
   const line = toLDrawLine(obj.matrixWorld, color, file);
  lines.push(line);
  }); */

  // before traversal:
  scene.updateMatrixWorld(true);
  scene.traverse(function (child) {
    var _ldraw_color_map$hex;
    if (!child.isMesh || !child.userData.ldraw) {
      return;
    }

    // –– COLOR LOOKUP ––
    var hex = child.material.color.getHexString().toUpperCase();
    if (!(hex in ldraw_color_map)) {
      console.warn("Unknown hex color:", hex);
    }
    var color_code = (_ldraw_color_map$hex = ldraw_color_map[hex]) !== null && _ldraw_color_map$hex !== void 0 ? _ldraw_color_map$hex : 16;

    // –– PART FILENAME ––
    var partName = child.userData.ldraw.replace("parts/", "");

    // –– POSITION ––
    /* const scaleFactor = 1000 / 0.4;          // meters→LDU
    const pos = new THREE.Vector3();
    child.getWorldPosition(pos);
    const x = (pos.x * scaleFactor).toFixed(2);
    const y = (pos.y * scaleFactor).toFixed(2);
    // flip Z to match LDraw’s left‑handed Z‑up
    const z = (-pos.z * scaleFactor).toFixed(2); */

    var pos = new THREE.Vector3();
    child.getWorldPosition(pos);
    var x = pos.x.toFixed(2);
    var y = pos.y.toFixed(2);
    var z = pos.z.toFixed(2);

    // –– ROTATION ––
    // Pull the 3×3 from matrixWorld directly:
    var e = child.matrixWorld.elements;
    // Three.js stores matrices column-major, so the 3×3 is:
    //  [ e[0]  e[4]  e[8] ]
    //  [ e[1]  e[5]  e[9] ]
    //  [ e[2]  e[6]  e[10]]
    // To write row-major “a b c d e f g h i”, we reorder:
    var a = e[0].toFixed(5),
      b = e[4].toFixed(5),
      c = e[8].toFixed(5),
      d = e[1].toFixed(5),
      ee = e[5].toFixed(5),
      f = e[9].toFixed(5),
      g = e[2].toFixed(5),
      h = e[6].toFixed(5),
      i = e[10].toFixed(5);

    // –– EMIT LINE ––
    var line = ["1", color_code, x, y, z, a, b, c, d, ee, f, g, h, i, partName].join(" ");
    lines.push(line);
  });
  var result = lines.join('\n');
  var date = getDate();
  var blob = new Blob([result], {
    type: 'text/plain'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = "creation-".concat(date, ".mpd");
  a.click();
  setTimeout(function () {
    return URL.revokeObjectURL(url);
  }, 10000);
}

/* function toLDrawLine(matrix4, colorCode, partName) {
    matrix4 = matrix4.clone();

    matrix4.multiply(new THREE.Matrix4().makeScale(1, 1, -1));

    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scl = new THREE.Vector3();
    matrix4.decompose(pos, quat, scl);
    matrix4.compose(pos, quat, scl);

    const e = matrix4.transpose().elements;

    //const scaleFactor = 1000 / 0.4; // meters to ldu
    //const tx = (e[3] * scaleFactor).toFixed(2);
    //const ty = (e[7] * scaleFactor).toFixed(2);
    //const tz = (e[11] * scaleFactor).toFixed(2);

    const tx = (e[3]).toFixed(2);
    const ty = (e[7]).toFixed(2);
    const tz = (e[11]).toFixed(2);

    const r11 = e[0].toFixed(5), r12 = e[1].toFixed(5), r13 = e[2].toFixed(5);
    const r21 = e[4].toFixed(5), r22 = e[5].toFixed(5), r23 = e[6].toFixed(5);
    const r31 = e[8].toFixed(5), r32 = e[9].toFixed(5), r33 = e[10].toFixed(5);
    
    return `1 ${colorCode} ${tx} ${ty} ${tz} ` + [r11, r12, r13, r21, r22, r23, r31, r32, r33].join(' ') + ` ${partName}`;
} */

document.getElementById("cre-import").addEventListener("change", function (event) {
  var file = event.target.files[0];
  if (!file) {
    console.error("No file selected");
    tooltip("No file selected.");
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var jsonData = JSON.parse(e.target.result);
      loadSceneFromJSON(jsonData);
    } catch (err) {
      tooltip("Invalid JSON file.");
      console.error(err);
    }
    event.target.value = "";
  };
  reader.readAsText(file);
});
document.getElementById("cre-import-ldr").addEventListener("change", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(event) {
    var file, asyncTraverse, _asyncTraverse, reader;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _asyncTraverse = function _asyncTraverse3() {
            _asyncTraverse = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(object, callback) {
              var _iterator, _step, child;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return callback(object);
                  case 2:
                    _iterator = _createForOfIteratorHelper(object.children);
                    _context5.prev = 3;
                    _iterator.s();
                  case 5:
                    if ((_step = _iterator.n()).done) {
                      _context5.next = 11;
                      break;
                    }
                    child = _step.value;
                    _context5.next = 9;
                    return asyncTraverse(child, callback);
                  case 9:
                    _context5.next = 5;
                    break;
                  case 11:
                    _context5.next = 16;
                    break;
                  case 13:
                    _context5.prev = 13;
                    _context5.t0 = _context5["catch"](3);
                    _iterator.e(_context5.t0);
                  case 16:
                    _context5.prev = 16;
                    _iterator.f();
                    return _context5.finish(16);
                  case 19:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5, null, [[3, 13, 16, 19]]);
            }));
            return _asyncTraverse.apply(this, arguments);
          };
          asyncTraverse = function _asyncTraverse2(_x4, _x5) {
            return _asyncTraverse.apply(this, arguments);
          };
          file = event.target.files[0];
          if (file) {
            _context6.next = 7;
            break;
          }
          console.error("No file selected");
          tooltip("No file selected.");
          return _context6.abrupt("return");
        case 7:
          reader = new FileReader();
          reader.onload = function (e) {
            try {
              var content = e.target.result;

              /* ldraw_loader.parse(content, function (creation) {
                  const converted = ldrawToJSON(creation);
                  console.log("converted: " + JSON.stringify(converted, null, 2));
                  loadSceneFromJSON(converted);
              }); */

              /* ldraw_loader.parse(e.target.result, async function (creation) {
                  creation.traverse(function (child) {
                  if (child?.userData?.fileName || child?.parent?.userData?.fileName || child?.parent?.parent?.userData?.fileName) {
                      let filename = child?.userData?.fileName || child?.parent?.userData?.fileName || child?.parent?.parent?.userData?.fileName;
                        part = 'parts/' + filename;
                      partName = filename;
                      console.log(part);
                        partColor = '#' + child?.material?.color?.getHexString();
                        partPosition = child.position.clone();
                      partRotation = child.rotation.clone();
                        addBlock();
                      child.visible = false;
                  }
                  if(child.isLineSegments) {
                      child.visible = false;
                  }
                  });
                    scene.add(creation);
                  scene.rotation.x += Math.PI;
              }); */

              ldraw_loader.parse(e.target.result, /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(creation) {
                  return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                    while (1) switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return asyncTraverse(creation, /*#__PURE__*/function () {
                          var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(child) {
                            var _child$userData, _child$parent, _child$parent$userDat, _child$parent2, _child$parent2$parent, _child$parent2$parent2;
                            var _child$userData2, _child$material, _child$material$color, filename, childColor;
                            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                              while (1) switch (_context3.prev = _context3.next) {
                                case 0:
                                  if (child !== null && child !== void 0 && (_child$userData = child.userData) !== null && _child$userData !== void 0 && _child$userData.fileName || child !== null && child !== void 0 && (_child$parent = child.parent) !== null && _child$parent !== void 0 && (_child$parent$userDat = _child$parent.userData) !== null && _child$parent$userDat !== void 0 && _child$parent$userDat.fileName || child !== null && child !== void 0 && (_child$parent2 = child.parent) !== null && _child$parent2 !== void 0 && (_child$parent2$parent = _child$parent2.parent) !== null && _child$parent2$parent !== void 0 && (_child$parent2$parent2 = _child$parent2$parent.userData) !== null && _child$parent2$parent2 !== void 0 && _child$parent2$parent2.fileName) {
                                    filename = child === null || child === void 0 ? void 0 : (_child$userData2 = child.userData) === null || _child$userData2 === void 0 ? void 0 : _child$userData2.fileName;
                                    part = 'parts/' + filename;
                                    partName = filename;

                                    //if(child?.material?.color) {
                                    childColor = '#' + (child === null || child === void 0 ? void 0 : (_child$material = child.material) === null || _child$material === void 0 ? void 0 : (_child$material$color = _child$material.color) === null || _child$material$color === void 0 ? void 0 : _child$material$color.getHexString()); //}
                                    partPosition = child.position.clone();
                                    partRotation = child.rotation.clone();
                                    console.log(child);
                                    addBlockV2(part, childColor, partPosition, partRotation, part, null, null);
                                    child.visible = false;
                                  }
                                  if (child.isLineSegments) {
                                    child.visible = false;
                                  }
                                case 2:
                                case "end":
                                  return _context3.stop();
                              }
                            }, _callee3);
                          }));
                          return function (_x7) {
                            return _ref5.apply(this, arguments);
                          };
                        }());
                      case 2:
                        console.log(creation.rotation.x);
                        creation.rotation.x += creation.rotation.x / 2;
                        console.log(creation.rotation.x);
                        scene.add(creation);
                        //scene.rotation.x += Math.PI;

                        /*scene.traverse(function (child) {
                            if (child?.userData?.ldraw) {
                                child.rotation.x -= Math.PI;
                                console.log(child.userData.ldraw);
                            }
                        });*/
                      case 6:
                      case "end":
                        return _context4.stop();
                    }
                  }, _callee4);
                }));
                return function (_x6) {
                  return _ref4.apply(this, arguments);
                };
              }());
            } catch (err) {
              tooltip("Invalid LDraw file.");
              console.error(err);
            }
            event.target.value = "";
          };
          reader.readAsText(file);
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
function loadSceneFromJSON(_x8) {
  return _loadSceneFromJSON.apply(this, arguments);
}
function _loadSceneFromJSON() {
  _loadSceneFromJSON = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
    var _iterator2, _step2, block;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          if (!(!data || !data.blocks || !Array.isArray(data.blocks))) {
            _context7.next = 4;
            break;
          }
          console.error("Invalid JSON data.");
          tooltip("Invalid JSON.");
          return _context7.abrupt("return");
        case 4:
          _iterator2 = _createForOfIteratorHelper(data.blocks);
          _context7.prev = 5;
          _iterator2.s();
        case 7:
          if ((_step2 = _iterator2.n()).done) {
            _context7.next = 25;
            break;
          }
          block = _step2.value;
          partName = block.ldraw;
          partColor = '#' + block.color;
          partPosition = block.position;
          partRotation = block.rotation;
          part = 'parts/' + block.ldraw;
          _context7.prev = 14;
          _context7.next = 17;
          return new Promise(function (resolve, reject) {
            //addBlock(resolve, reject);
            addBlockV2(part, partColor, partPosition, partRotation, null, null, resolve, reject);
          });
        case 17:
          _context7.next = 23;
          break;
        case 19:
          _context7.prev = 19;
          _context7.t0 = _context7["catch"](14);
          console.warn("Failed to add block: ".concat(block.ldraw), _context7.t0);
          tooltip("Failed to load ".concat(block.ldraw));
        case 23:
          _context7.next = 7;
          break;
        case 25:
          _context7.next = 30;
          break;
        case 27:
          _context7.prev = 27;
          _context7.t1 = _context7["catch"](5);
          _iterator2.e(_context7.t1);
        case 30:
          _context7.prev = 30;
          _iterator2.f();
          return _context7.finish(30);
        case 33:
          console.log("Creation imported.");
          tooltip("Creation imported.");
          updateSceneData();
        case 36:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[5, 27, 30, 33], [14, 19]]);
  }));
  return _loadSceneFromJSON.apply(this, arguments);
}
function ldrawToJSON(group) {
  var blocks = [];
  var ldraw_code_to_hex = {
    // row 1
    4: "C91A09",
    // Bright Red
    14: "F8CC00",
    // Bright Yellow
    12: "0020A0",
    // Bright Blue
    28: "005700",
    // Dark Green
    10: "FE8A18",
    // Bright Orange
    124: "D941BB",
    // Bright Violet

    // row 2
    0: "000000",
    // Black
    15: "FFFFFF",
    // White
    294: "747371",
    // Dark Stone Grey
    295: "A3A2A4",
    // Medium Stone Grey
    5: "958A73",
    // Dark Tan
    8: "6C5C4D",
    // Brown

    // row 3
    308: "812A00",
    // Dark Brown
    23: "5883C1",
    // Medium Blue
    37: "4B974B",
    // Sand Green
    59: "A52A2A",
    // Dark Red
    38: "B36D2C",
    // Dark Orange
    223: "FCB7BC",
    // Bright Pink

    // row 4
    212: "60C0E0",
    // Bright Light Blue
    226: "FBE696",
    // Earth Yellow
    36: "84B68D",
    // Bright Green
    335: "92B28B",
    // Lime Green
    26: "002A5A",
    // Dark Blue
    334: "DDDD22" // Vibrant Yellow
  };

  group.traverse(function (child) {
    var _child$parent3, _child$parent4, _child$parent4$userDa;
    if (child !== null && child !== void 0 && child.isGroup && child !== null && child !== void 0 && child.parent && child !== null && child !== void 0 && (_child$parent3 = child.parent) !== null && _child$parent3 !== void 0 && _child$parent3.userData && child !== null && child !== void 0 && (_child$parent4 = child.parent) !== null && _child$parent4 !== void 0 && (_child$parent4$userDa = _child$parent4.userData) !== null && _child$parent4$userDa !== void 0 && _child$parent4$userDa.fileName) {
      var _child$parent5, _child$parent5$userDa, _child$parent6, _child$parent7, _child$parent7$userDa;
      console.log(child === null || child === void 0 ? void 0 : child.userData);
      console.log(child === null || child === void 0 ? void 0 : (_child$parent5 = child.parent) === null || _child$parent5 === void 0 ? void 0 : (_child$parent5$userDa = _child$parent5.userData) === null || _child$parent5$userDa === void 0 ? void 0 : _child$parent5$userDa.fileName);
      var ldraw_data = child === null || child === void 0 ? void 0 : (_child$parent6 = child.parent) === null || _child$parent6 === void 0 ? void 0 : _child$parent6.userData;
      fetch("https://raw.githubusercontent.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/actual/".concat(ldraw_data.fileName)).then(function (res) {
        return res;
      }).then(function (data) {
        if (data === null) {
          ldraw_data.fileName = 'p/empty.dat';
        }
      });
      var fileName = ldraw_data.fileName || "3001.dat";
      var colorHex;
      if (child !== null && child !== void 0 && (_child$parent7 = child.parent) !== null && _child$parent7 !== void 0 && (_child$parent7$userDa = _child$parent7.userData) !== null && _child$parent7$userDa !== void 0 && _child$parent7$userDa.colorCode) {
        var _ldraw_code_to_hex$co;
        var colorCode = child.parent.userData.colorCode;
        if (!(colorCode in ldraw_code_to_hex)) {
          console.warn("Unknown color code color:", colorCode);
        }
        colorHex = (_ldraw_code_to_hex$co = ldraw_code_to_hex[colorCode]) !== null && _ldraw_code_to_hex$co !== void 0 ? _ldraw_code_to_hex$co : "ffffff";
      } else {
        colorHex = "ffffff";
      }
      var worldPos = new THREE.Vector3();
      child.parent.getWorldPosition(worldPos);
      var worldQuat = new THREE.Quaternion();
      child.parent.getWorldQuaternion(worldQuat);
      var euler = new THREE.Euler().setFromQuaternion(worldQuat);
      child.parent.scale.set(1, 1, 1);
      blocks.push({
        color: colorHex,
        position: {
          x: worldPos.x,
          y: worldPos.y,
          z: worldPos.z
        },
        rotation: {
          x: euler.x,
          y: euler.y,
          z: euler.z
        },
        ldraw: fileName
      });
    }
  });
  console.log({
    blocks: blocks
  });
  return {
    blocks: blocks
  };
}

/*document.getElementById("import-btn-three").addEventListener("click", function () {
    document.getElementById("cre-import-three").click();
}); */

document.getElementById("cre-import-three").addEventListener("change", function (event) {
  var file = event.target.files[0];
  if (!file) {
    console.error("No file selected");
    tooltip("No file selected");
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var data = JSON.parse(e.target.result);
      var loader = new THREE.ObjectLoader();
      var object;
      if (!Array.isArray(data)) {
        var _data$metadata, _data$metadata2, _data$object;
        if (data !== null && data !== void 0 && data.metadata && data !== null && data !== void 0 && (_data$metadata = data.metadata) !== null && _data$metadata !== void 0 && _data$metadata.type && (data === null || data === void 0 ? void 0 : (_data$metadata2 = data.metadata) === null || _data$metadata2 === void 0 ? void 0 : _data$metadata2.type) === "App" && data !== null && data !== void 0 && data.object && data !== null && data !== void 0 && (_data$object = data.object) !== null && _data$object !== void 0 && _data$object.metadata) {
          object = loader.parse(data.object);
        } else {
          object = loader.parse(data);
        }
        object.children.forEach(function (child) {
          child.userData.noSnap = true;
          child.userData.isBlock = true;
          child.userData.partName = object.ldraw;
          child.ldraw = object.ldraw;
          scene.add(child);
        });
      } else {
        data.forEach(function (item) {
          var _item$object, _item$object2, _item$object2$metadat, _item$object3, _item$object3$metadat, _item$metadata;
          if (item !== null && item !== void 0 && (_item$object = item.object) !== null && _item$object !== void 0 && _item$object.metadata && item !== null && item !== void 0 && (_item$object2 = item.object) !== null && _item$object2 !== void 0 && (_item$object2$metadat = _item$object2.metadata) !== null && _item$object2$metadat !== void 0 && _item$object2$metadat.type && (item === null || item === void 0 ? void 0 : (_item$object3 = item.object) === null || _item$object3 === void 0 ? void 0 : (_item$object3$metadat = _item$object3.metadata) === null || _item$object3$metadat === void 0 ? void 0 : _item$object3$metadat.type) === "App") {
            object = loader.parse(item.object);
          } else if (item !== null && item !== void 0 && item.metadata && item !== null && item !== void 0 && (_item$metadata = item.metadata) !== null && _item$metadata !== void 0 && _item$metadata.type) {
            object = loader.parse(item);
          }
        });
      }
      if (selectedObject) {
        transformControls.detach(selectedObject);
        selectedObject = null;
      }
    } catch (err) {
      tooltip("error: ".concat(err));
      console.error(err);
    }
    event.target.value = "";
    updateSceneData();
  };
  reader.readAsText(file);
});
var container,
  camera,
  scene,
  renderer,
  controls,
  transformControls,
  grid_helper,
  directional_lighting,
  ambient_lighting,
  ldraw_loader,
  loading_manager,
  mouse,
  raycaster,
  partRotation,
  partPosition,
  selectedObject,
  customPosition,
  selectedMap,
  selectedExport,
  named_parts = null;
var blocks = [];
var blockGroups = [];
init();
animate();
function getCookie(name) {
  var cookies = document.cookie;
  var parts = cookies.split(name + "=");
  var cookieValue = null;
  if (parts.length == 2) {
    cookieValue = parts.pop().split(";").shift();
  }
  return cookieValue;
}
function toggleGlobalSnap() {
  if (scene.userData.noSnap === true) {
    scene.userData.noSnap = false;
  } else {
    scene.userData.noSnap = true;
  }
  scene.updateMatrixWorld(true);
  save_settings();
}

// toggle smooth normals
// todo make this actually work
document.getElementById("smooth-normals-enable").addEventListener("change", function () {
  ldraw_loader.smoothNormals = this.checked;
  scene.traverse(function (child) {
    if (child.isMesh && child.userData.isBlock && child.geometry) {
      if (Array.isArray(child.material)) {
        child.material.forEach(function (mat) {
          mat.flatShading = !ldraw_loader.smoothNormals;
          mat.needsUpdate = true;
        });
      } else {
        child.material.flatShading = !ldraw_loader.smoothNormals;
        child.material.needsUpdate = true;
      }
    }
  });
  scene.updateMatrixWorld(true);
  save_settings();
});
document.getElementById("display-lines-enable").addEventListener("change", function () {
  var displayLines = this.checked;
  scene.userData.displayLines = displayLines;
  scene.traverse(function (obj) {
    if (obj.isLineSegments && obj.userData && obj.userData.ldr_line === true) {
      obj.visible = displayLines;
    }
  });
  scene.updateMatrixWorld(true);
  save_settings();
});
document.getElementById("pbr-enable").addEventListener("change", function () {
  var highRes = this.checked;
  scene.userData.highRes = highRes;
  scene.traverse(function (obj) {
    var _obj$userData;
    if (obj !== null && obj !== void 0 && obj.userData && (obj === null || obj === void 0 ? void 0 : (_obj$userData = obj.userData) === null || _obj$userData === void 0 ? void 0 : _obj$userData.isBlock) === true) {
      if (highRes) {
        var _obj$material;
        obj.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(obj === null || obj === void 0 ? void 0 : (_obj$material = obj.material) === null || _obj$material === void 0 ? void 0 : _obj$material.color),
          reflectivity: 0.5,
          roughness: 0.4,
          metalness: 0.1,
          envMapIntensity: 0.5
        });
      } else {
        var _obj$material2;
        obj.material = new THREE.MeshLambertMaterial({
          color: new THREE.Color(obj === null || obj === void 0 ? void 0 : (_obj$material2 = obj.material) === null || _obj$material2 === void 0 ? void 0 : _obj$material2.color)
        });
      }
    }
  });
  scene.updateMatrixWorld(true);
  save_settings();
});

/*document.getElementById("trans-enable").addEventListener("change", function () {
    const ui_trans = this.checked;
    scene.userData.ui_trans = ui_trans;

    if(scene.userData.ui_trans) {
        //document.getElementsByClassName('ui-popup-contain').classList.add('trans');

        // Source - https://stackoverflow.com/a/24219779
        // Posted by James Hill, modified by community. See post 'Timeline' for change history
        // Retrieved 2025-12-18, License - CC BY-SA 3.0

        let elements = document.querySelectorAll('.ui-canbe-trans');

        //for(let i = 0; i < element.length; i++) {
            //element[i].classList.add('trans');
        //}

        elements.forEach(element => {
            element.classList.add('trans');
        });
    } else {
        //let element = document.getElementsByClassName('ui-canbe-trans');
        let elements = document.querySelectorAll('.ui-canbe-trans');

        //for(let i = 0; i < element.length; i++) {
            //element[i].classList.remove('trans');
        //}

        elements.forEach(element => {
            element.classList.add('trans');
        });
    }

    scene.updateMatrixWorld(true);
    save_settings();
});*/

document.getElementById("trans-enable").addEventListener("change", function () {
  var ui_trans = this.checked;
  scene.userData.ui_trans = ui_trans;
  applyTransparent(scene.userData.ui_trans);
});
document.getElementById("hdr-enable").addEventListener("change", function () {
  var use_hdri = this.checked;
  scene.userData.use_hdri = use_hdri;

  /*if(scene.userData.use_hdri) {
      const rgbe_loader = new THREE.RGBELoader();
      //https://polyhaven.com/a/autumn_field_puresky
      rgbe_loader.load('https://cdn.jsdelivr.net/gh/susstevedev/gr8brik/lib/autumn_field_puresky_1k.hdr', function (texture) {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = texture;
      });
      scene.updateMatrixWorld(true);
      save_settings();
  } else {
      scene.environment = null;
      scene.updateMatrixWorld(true);
      save_settings();
  }*/

  applyHdri(scene.userData.use_hdri);
});
function applyTransparent(ui_trans) {
  if (ui_trans) {
    // Source - https://stackoverflow.com/a/24219779
    // Posted by James Hill, modified by community. See post 'Timeline' for change history
    // Retrieved 2025-12-18, License - CC BY-SA 3.0

    var elements = document.querySelectorAll('.ui-canbe-trans');
    elements.forEach(function (element) {
      element.classList.add('trans');
    });
  } else {
    var _elements = document.querySelectorAll('.ui-canbe-trans');
    _elements.forEach(function (element) {
      element.classList.remove('trans');
    });
  }
  scene.updateMatrixWorld(true);
  save_settings();
}
function applyHdri(use_hdri) {
  if (use_hdri) {
    var rgbe_loader = new THREE.RGBELoader();
    //https://polyhaven.com/a/autumn_field_puresky
    rgbe_loader.load('https://cdn.jsdelivr.net/gh/susstevedev/gr8brik/lib/autumn_field_puresky_1k.hdr', function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });
    scene.updateMatrixWorld(true);
    save_settings();
  } else {
    scene.environment = null;
    scene.updateMatrixWorld(true);
    save_settings();
  }
}
function isDark() {
  if (getCookie('mode')) {
    if (getCookie('mode') === 'dark') {
      return true;
    } else {
      return false;
    }
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return true;
    } else {
      return false;
    }
  }
}
function snapToGrid(value, gridSize) {
  return Math.round(value / gridSize) * gridSize;
}
function getDate() {
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var dd = String(today.getDate()).padStart(2, '0');
  return "".concat(yyyy, "-").concat(mm, "-").concat(dd);
}
function init() {
  if (isDark()) {
    document.body.classList.add("dark");
  } else {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
    }
  }

  // Scene container
  container = document.createElement('div');
  container.classList.add("scene");
  document.body.appendChild(container);

  // Scene
  scene = new THREE.Scene();
  scene.userData.noSnap = false;
  scene.userData.displayLines = false;
  read_settings();
  THREE.Cache.enabled = false;

  // transparent ui
  if (scene.userData.ui_trans || scene.userData.ui_trans === undefined || scene.userData.ui_trans === null) {
    /*let element = document.getElementsByClassName('ui-popup-contain');
     for(let i = 0; i < element.length; i++) {
        element[i].classList.add('trans');
    }*/

    applyTransparent(scene.userData.ui_trans);
  }

  //hdri
  if (scene.userData.use_hdri || scene.userData.use_hdri === undefined || scene.userData.use_hdri === null) {
    /*let element = document.getElementsByClassName('ui-popup-contain');
     for(let i = 0; i < element.length; i++) {
        element[i].classList.add('trans');
    }*/

    applyHdri(scene.userData.use_hdri);
  }

  // WebGl renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // set pixel ratio
  // @the_an0nym pointed out how if your screen resolution isn't 100% (and in some cases just always), the scene looks buggy
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Camera
  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, .1, 100000);
  camera.position.set(250, 250, 250);

  // Lighting
  ambient_lighting = new THREE.AmbientLight(0xdddddd, 1);
  scene.add(ambient_lighting);
  directional_lighting = new THREE.DirectionalLight(0xffffff, 2);
  directional_lighting.position.set(250, 250, 250);
  scene.add(directional_lighting);
  transformControls = new THREE.TransformControls(camera, renderer.domElement);
  transformControls.size = 0.75;
  scene.add(transformControls);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.8;
  var stud_size = 20; // 1 stud = 20 three/ldr units
  var grid_size = stud_size * 16; // studs wide
  var divisions = 16; // 1 division per stud

  if (isDark()) {
    grid_helper = new THREE.GridHelper(grid_size, divisions, 0xfafafa, 0xfafafa);
    scene.add(grid_helper);
  } else {
    grid_helper = new THREE.GridHelper(grid_size, divisions, 0x242424, 0x242424);
    scene.add(grid_helper);
  }
  loading_manager = new THREE.LoadingManager();
  loading_manager.setURLModifier(function (url) {
    return url;
  });
  loading_manager.onError = function (url) {
    console.warn("missing part " + url);
    loading_manager.itemEnd(url);
  };
  named_parts = new Map();

  // loader config
  // please read ldrawloader docs before changing these values
  var ldraw_path = "https://raw.githubusercontent.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/";
  ldraw_loader = new THREE.LDrawLoader();
  ldraw_loader.preloadMaterials(ldraw_path + 'colors/ldconfig.ldr');
  ldraw_loader.setPath(ldraw_path + 'actual/');
  ldraw_loader.setPartsLibraryPath(ldraw_path + 'actual/');
  //ldraw_loader.setFileMap(named_parts);
  ldraw_loader.separateObjects = true;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  window.addEventListener('keydown', function (event) {
    var activeElement = document.activeElement;
    if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
      return;
    }
    switch (event.code) {
      case 'KeyT':
        moveBlock('t');
        break;
      case 'KeyR':
        moveBlock('r');
        break;
      case 'KeyS':
        moveBlock('s');
        break;
      case 'Escape':
        deselect(selectedObject);
        break;
      case 'Delete':
        deleteBlock(selectedObject);
        break;
      case 'ArrowUp':
        selectedObject.rotation.x -= THREE.MathUtils.degToRad(45);
        updateSceneData();
        break;
      case 'ArrowDown':
        selectedObject.rotation.x += THREE.MathUtils.degToRad(45);
        updateSceneData();
        break;
      case 'ArrowLeft':
        selectedObject.rotation.y -= THREE.MathUtils.degToRad(45);
        updateSceneData();
        break;
      case 'ArrowRight':
        selectedObject.rotation.y += THREE.MathUtils.degToRad(45);
        updateSceneData();
        break;
    }
  });
  document.getElementById('move-block-t').addEventListener('click', function () {
    if (selectedObject) {
      moveBlock('t');
    }
  });
  document.getElementById('move-block-r').addEventListener('click', function () {
    if (selectedObject) {
      moveBlock('r');
    }
  });
  window.addEventListener('resize', onWindowResize, true);
  transformControls.addEventListener('mouseDown', function () {
    controls.enabled = false;
  });
  transformControls.addEventListener('mouseUp', function () {
    controls.enabled = true;
  });
  transformControls.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
  });
  var original_pos = new THREE.Vector3();
  var original_rot = new THREE.Euler();
  transformControls.addEventListener('mouseDown', function () {
    if (selectedObject) {
      original_pos.copy(selectedObject.position);
      original_rot.copy(selectedObject.rotation);
    }
  });
  transformControls.addEventListener('objectChange', function () {
    if (selectedObject && !(selectedObject.userData.noSnap || scene.userData.noSnap)) {
      var _selectedObject;
      var delta_pos = new THREE.Vector3().subVectors(selectedObject.position, original_pos);
      var snapped_pos = new THREE.Vector3(snapToGrid(delta_pos.x, 10), snapToGrid(delta_pos.y, 4), snapToGrid(delta_pos.z, 10));
      var final_pos = original_pos.clone().add(snapped_pos);
      selectedObject.position.copy(final_pos);
      var delta_rot = new THREE.Euler(selectedObject.rotation.x - original_rot.x, selectedObject.rotation.y - original_rot.y, selectedObject.rotation.z - original_rot.z);
      var snapped_rot = new THREE.Euler(Math.round(delta_rot.x / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45), Math.round(delta_rot.y / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45), Math.round(delta_rot.z / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45));
      var final_rot = new THREE.Euler(original_rot.x + snapped_rot.x, original_rot.y + snapped_rot.y, original_rot.z + snapped_rot.z);
      selectedObject.rotation.copy(final_rot);
      selectedObject.updateMatrixWorld(true);
      scene.updateMatrixWorld(true);
      partPosition = ((_selectedObject = selectedObject) === null || _selectedObject === void 0 ? void 0 : _selectedObject.pos) || null;
      partRotation = null; // default im not fucking around with rotation rn
    }

    updateSceneData();
  });
}
function changeBlockColor(color) {
  if (!selectedObject) {
    tooltip("No part selected");
    return;
  }
  selectedObject.traverse(function (child) {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        var mat;
        if (selectedMap != null) {
          if (child.material[selectedMap]) {
            mat = child.material[selectedMap];
          } else {
            selectedMap = null;
            tooltip('Invalid multi color map selected');
            return;
          }
        } else {
          /*if(child.userData.main_mat_uuid != undefined) {
          	mat = child.material[child.userData.main_mat_index];
          	selectedMap = child.userData.main_mat_index;
          } else {
          	mat = child.material[0];
          	selectedMap = 0;
          }*/

          if (child.userData.main_mat_name != undefined) {
            mat = child.material[child.userData.main_mat_index];
            selectedMap = child.userData.main_mat_index;
          } else {
            mat = child.material[0];
            selectedMap = 0;
          }
        }
        if (mat && mat.color && !mat.map) {
          /*mat.color.set(color);
          mat.needsUpdate = true;*/

          //let cloned_mat = mat.clone();
          //cloned_mat.color.set(color);
          //cloned_mat.color = new THREE.Color(color || "#ffffff");
          //child.material[child.userData.main_mat_index] = mat.clone();

          console.log(child.material[child.userData.main_mat_index]);
          child.material[selectedMap].color = new THREE.Color(color || "#ffffff");
          console.log(selectedMap);
          child.material[selectedMap].needsUpdate = true;

          /*mat = child.material[child.userData.main_mat_index];
          cloned_mat = mat;*/

          //console.log(cloned_mat.color.getHexString().toLowerCase());
        }

        document.querySelector('#selected-map').value = selectedMap;
        selectedMap = null;
        updateSceneData();
        updateBLItems();
      } else if (child.material.color) {
        child.material.color.set(color);
        child.material.needsUpdate = true;
        updateSceneData();
        updateBLItems();
      }
    }
  });
  console.log("Part color changed to ".concat(color));
  tooltip("Part color changed to ".concat(color));
}
function deleteBlock(part) {
  if (part) {
    if (part.isMesh || part.isGroup) {
      if (part.parent) {
        transformControls.detach(selectedObject);
        selectedObject = null;
        part.parent.remove(part);
      }
      part.updateMatrixWorld(true);
      tooltip('Deleted part');
    } else {
      tooltip('Part is not a valid mesh');
    }

    /*if (blockGroups && blockGroups.length > 0) {
        blockGroups.forEach(function (g) {
        if(g.uuid === part.parent.uuid) {
            if(g.part) {
                g.remove(part);
            }
            g.updateMatrixWorld(true);
            updateBLItem(g.userData.partName, color, g.userData.sceneCount, g.uuid);
        }
        });
    } */

    updateBLItems();
    if (selectedObject === part) {
      deselect(part);
    }
  } else {
    tooltip('No part found');
  }
  scene.updateMatrixWorld(true);
  updateSceneData();
}

/* Screenshot function */
function capture() {
  var thumb = new THREE.Scene();
  thumb.background = null;
  var count = 0;
  if (selectedObject) {
    transformControls.detach(selectedObject);
    transformControls.visible = false;
  }
  scene.traverse(function (object) {
    if (object.isMesh) {
      var cloned = clone_mesh_clean(object);
      if (cloned) {
        thumb.add(cloned);
        if (object.userData.isBlock) {
          cloned.rotation.setFromQuaternion(cloned.quaternion);
          /* cloned.rotation.z += Math.PI;
          cloned.rotation.y += Math.PI; */
        }

        console.log(cloned);
        count++;
      }
    }
  });
  if (count === 0) {
    console.warn("scene is empty");
    return null;
  }
  var light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(250, 250, 250);
  thumb.add(light2);
  var camera2 = camera.clone();
  var ambient2 = new THREE.AmbientLight(0xdddddd);
  thumb.add(ambient2);
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.setClearColor(0x000000, 0); // transparent
  renderer.setSize(600, 600);
  renderer.render(thumb, camera2);
  var thumbnail = renderer.domElement.toDataURL("image/webp");
  return thumbnail;
  if (selectedObject) {
    transformControls.attach(selectedObject);
    transformControls.visible = true;
  }
}
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}

// Last cleaned up 6/2/2025 by susstevedev
function addBlock(throwSuccess, throwError) {
  if (!ldraw_loader) {
    console.error('LdrawLoader is missing or not loaded yet.');
    tooltip('Something really, really, wrong has occured. Weird...');
    return;
  }
  if (!part) {
    console.error('No part is selected!');
    tooltip('Please select a part.');
    return;
  }
  if (!partColor) {
    console.warn('Part color is not set. Setting color as white.');
    partColor = "#ffffff";
  }
  transformControls.detach(selectedObject);
  console.log("Loading part:", part);
  ldraw_loader.load(part, function (loadedGroup) {
    if (!loadedGroup) {
      console.error("Loaded group does not exist.");
      tooltip('Please select a block with valid mesh data');
      return;
    }
    var blockGroup = new THREE.Group();
    blockGroup.name = "ldraw_".concat(makeid(10));
    blockGroup.ldraw = part;
    var display_lines = scene.userData.displayLines;
    loadedGroup.traverse(function (child) {
      if (child.isLineSegments && child.parent.isGroup) {
        child.visible = false;
        return;
      }
      if (child.isMesh && !child.material.map && !child.isLineSegments && !Array.isArray(child.material)) {
        var _scene2, _scene2$userData;
        var pos = new THREE.Vector3();
        var pos2 = child.getWorldPosition(pos);
        console.log(pos2);
        if (((_scene2 = scene) === null || _scene2 === void 0 ? void 0 : (_scene2$userData = _scene2.userData) === null || _scene2$userData === void 0 ? void 0 : _scene2$userData.highRes) === true) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(partColor || "#ffffff"),
            reflectivity: 0.5,
            shininess: 75,
            roughness: 0.4,
            metalness: 0.1,
            envMapIntensity: 0.5
          });
        } else {
          child.material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(partColor || "#ffffff")
          });
        }
        child.userData.isBlock = true;
        child.userData.isTexture = false;
        child.userData.ldraw = child.parent.userData.fileName || partName;
        child.userData.ldr_line = false;
        transformControls.attach(child);
        selectedObject = child;
      }
      if (child.material && child.material.map && child.isMesh && !child.isLineSegments) {
        child.userData.isBlock = true;
        child.userData.isTexture = true;
        child.userData.ldraw = child.parent.userData.fileName || partName;
        child.userData.ldr_line = false;
      }
      child.userData.parentName = partName;
      child.userData.id = makeid(15);
      child.userData.original_mat = child.material;
      if (child.material && child.isMesh && !child.isLineSegments) {
        var edges = new THREE.EdgesGeometry(child.geometry);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
          color: 0x000000
        }));
        line.userData.ldr_line = true;
        child.add(line);
        if (display_lines != true) {
          line.visible = false;
        }
      }
    });
    blockGroup.add(loadedGroup);
    if (partPosition && partRotation) {
      blockGroup.position.set(partPosition.x, partPosition.y, partPosition.z);
      blockGroup.rotation.set(partRotation.x, partRotation.y, partRotation.z);
    } else {
      blockGroup.position.y = objectSize(blockGroup).y;
      blockGroup.rotation.x = Math.PI;
    }
    blockGroup.userData.partName = partName;
    scene.add(blockGroup);
    blocks.push(blockGroup);
    blockGroups.push(blockGroup);
    blockGroup.sceneCount = blocks.length;
    tooltip("Added part ".concat(part.replace("parts/", "")));

    /* const texturename = `${part.split("/").pop().split(".")[0]}.png`;
    const texturepath = `https://raw.githubusercontent.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/actual/parts/textures/${texturename}`;
    const texturepath = 'https://d1xez26aurxsp6.cloudfront.net/users/qXBby2/avatars/680a924dab4ba.png';
    const textureLoader = new THREE.TextureLoader();
     textureLoader.load(texturepath, (texturemap) => {
        texturemap.colorSpace = THREE.SRGBColorSpace;
        blockGroup.traverse(child => {
            if (child.isMesh && child.material) {
                child.material.map = texturemap;
                child.material.needsUpdate = true;
            }
        });
    }, undefined, (err) => {
        console.warn("Texture load failed or doesn't exist:", err);
    }); */

    updateBLItems();
    updateSceneData();
    throwSuccess();
  }, undefined, function (error) {
    console.error('error loading piece:', error);
    throwError(error);
  });
}

/* addBlock version 2 */
function addBlockV2(part, partColor, partPosition, partRotation, partSpan, originalPSImg, fileName, throwSuccess, throwError) {
  var FILE_LOCATION_TRY_PARTS = 0;
  var FILE_LOCATION_TRY_P = 1;
  var FILE_LOCATION_TRY_MODELS = 2;
  var FILE_LOCATION_AS_IS = 3;
  var FILE_LOCATION_TRY_RELATIVE = 4;
  var FILE_LOCATION_TRY_ABSOLUTE = 5;
  var FILE_LOCATION_NOT_FOUND = 6;
  if (!ldraw_loader) {
    console.error('LdrawLoader is missing or not loaded yet.');
    tooltip('Something really, really, weird has occured.');
    return;
  }
  if (!part) {
    console.error('No part is selected!');
    tooltip('Please select a part.');
    return;
  }
  if (!partColor) {
    console.warn('Part color is not set. Setting color as white.');
    partColor = "#ffffff";
  }
  transformControls.detach(selectedObject);
  console.log("Loading part:", part);
  if (!fileName || fileName === undefined || fileName === null) {
    fileName = part;
  }
  console.log(fileName);
  ldraw_loader.load(fileName, function (loadedGroup) {
    if (!loadedGroup) {
      console.error("Loaded group does not exist.");
      tooltip('Please select a block with valid mesh data');
      return;
    }
    var blockGroup = new THREE.Group();
    blockGroup.name = "ldraw_".concat(makeid(10));
    blockGroup.ldraw = part;
    var display_lines = scene.userData.displayLines;
    loadedGroup.traverse(function (child) {
      if (child.isLineSegments && child.parent.isGroup) {
        child.visible = false;
        return;
      }
      if (child.isMesh && !child.material.map && !child.isLineSegments && !Array.isArray(child.material)) {
        var _scene3, _scene3$userData;
        var pos = new THREE.Vector3();
        var pos2 = child.getWorldPosition(pos);
        console.log(pos2);
        if (((_scene3 = scene) === null || _scene3 === void 0 ? void 0 : (_scene3$userData = _scene3.userData) === null || _scene3$userData === void 0 ? void 0 : _scene3$userData.highRes) === true) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(partColor || "#ffffff"),
            reflectivity: 0.5,
            roughness: 0.4,
            metalness: 0.1,
            envMapIntensity: 0.5
          });
        } else {
          child.material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(partColor || "#ffffff")
          });
        }
        child.userData.isBlock = true;
        child.userData.isTexture = false;
        child.userData.ldraw = child.parent.userData.fileName || partName;
        child.userData.ldr_line = false;
        transformControls.attach(child);
        selectedObject = child;
      }
      if (child.material && child.material.map && child.isMesh && !child.isLineSegments) {
        child.userData.isBlock = true;
        child.userData.isTexture = true;
        child.userData.ldraw = child.parent.userData.fileName || partName;
        child.userData.ldr_line = false;

        // main color uuid, for minifig textures
        if (Array.isArray(child.material)) {
          child.material.forEach(function (mat) {
            console.log(mat.name);
            if (mat.name.includes("Main_Colour")) {
              //if(mat.name === " Main_Colour") {
              var index = child.material.map(function (mmap) {
                return mmap.uuid;
              }).indexOf(mat.uuid);
              child.material[index] = mat.clone();
              child.material[index].needsUpdate = true;
              mat.name = child.material[index].name + '_' + makeid(5);
              child.userData.main_mat_uuid = mat.uuid;
              child.userData.main_mat_name = mat.name;
              child.userData.main_mat_index = index;
              console.log(index);
              if (partColor) {
                child.material[index].color = new THREE.Color(partColor || "#ffffff");
              }
            } else {
              var index = child.material.map(function (mmap) {
                return mmap.uuid;
              }).indexOf(mat.uuid);
              child.material[index] = mat.clone();
              child.material[index].needsUpdate = true;
            }
          });
        }
      }
      child.userData.parentName = partName;
      child.userData.id = makeid(15);
      child.userData.original_mat = child.material;
      if (child.material && child.isMesh && !child.isLineSegments) {
        var edges = new THREE.EdgesGeometry(child.geometry);
        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
          color: 0x000000
        }));
        line.userData.ldr_line = true;
        child.add(line);
        if (display_lines != true) {
          line.visible = false;
        }
      }
    });
    blockGroup.add(loadedGroup);
    if (partPosition && partRotation) {
      blockGroup.position.set(partPosition.x, partPosition.y, partPosition.z);
      blockGroup.rotation.set(partRotation.x, partRotation.y, partRotation.z);
    } else {
      blockGroup.position.y = objectSize(blockGroup).y;
      blockGroup.rotation.x = Math.PI;
    }
    blockGroup.userData.partName = partName;
    scene.add(blockGroup);
    blocks.push(blockGroup);
    blockGroups.push(blockGroup);
    blockGroup.sceneCount = blocks.length;
    tooltip("Added part ".concat(part.replace("parts/", "")));

    /* const texturename = `${part.split("/").pop().split(".")[0]}.png`;
    const texturepath = `https://raw.githubusercontent.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/actual/parts/textures/${texturename}`;
    const texturepath = 'https://d1xez26aurxsp6.cloudfront.net/users/qXBby2/avatars/680a924dab4ba.png';
    const textureLoader = new THREE.TextureLoader();
     textureLoader.load(texturepath, (texturemap) => {
        texturemap.colorSpace = THREE.SRGBColorSpace;
        blockGroup.traverse(child => {
            if (child.isMesh && child.material) {
                child.material.map = texturemap;
                child.material.needsUpdate = true;
            }
        });
    }, undefined, (err) => {
        console.warn("Texture load failed or doesn't exist:", err);
    }); */

    updateBLItems();
    updateSceneData();
    if (partSpan && partSpan !== null && partSpan !== undefined) {
      partSpan.querySelector('img').setAttribute("src", originalPSImg);
    }
    throwSuccess();
  }, undefined, function (error) {
    if (error.code === 20 || error.code === "20") {
      /*let part_urls = [
          'parts/',
          'p/',
          'parts/p/',
          'p/48/',
          'p/8/',
          'parts/s/',
      ];
       part_urls.forEach((url, count) => {
      if(count != 7) {
      let partmain = part.replace('parts/', "");
      let fileName2 = url + partmain;
      console.log('RETRY. Part location: ' + fileName2);
      addBlockV2(part, partColor, partPosition, partRotation, partSpan, originalPSImg, fileName2, throwSuccess, throwError);
      } else {
      throw new Error('An error has occured');
      }
      }); */
      var addBlockLocation = function addBlockLocation(locationState, triedLowerCase) {
        var fileName2 = fileName.replace('parts/', '');
        var subobjectURL = fileName2;
        if (locationState === FILE_LOCATION_NOT_FOUND) {
          throw new Error('Subobject "' + fileName + '" could not be loaded.');
        }
        switch (locationState) {
          case FILE_LOCATION_AS_IS:
            locationState = locationState + 1;
            break;
          case FILE_LOCATION_TRY_PARTS:
            subobjectURL = 'parts/' + subobjectURL;
            locationState = locationState + 1;
            break;
          case FILE_LOCATION_TRY_P:
            subobjectURL = 'p/' + subobjectURL;
            locationState = locationState + 1;
            break;
          case FILE_LOCATION_TRY_MODELS:
            subobjectURL = 'models/' + subobjectURL;
            locationState = locationState + 1;
            break;
          case FILE_LOCATION_TRY_RELATIVE:
            subobjectURL = fileName.substring(0, fileName.lastIndexOf('/') + 1) + subobjectURL;
            locationState = locationState + 1;
            break;
          case FILE_LOCATION_TRY_ABSOLUTE:
            if (triedLowerCase) {
              // Try absolute path
              locationState = FILE_LOCATION_NOT_FOUND;
            } else {
              // Next attempt is lower case
              fileName = fileName.toLowerCase();
              subobjectURL = fileName2;
              triedLowerCase = true;
              locationState = FILE_LOCATION_TRY_PARTS;
            }
            break;
        }
        addBlockV2(part, partColor, partPosition, partRotation, partSpan, originalPSImg, subobjectURL, function () {
          console.log('done');
          return;
        }, function () {
          addBlockLocation(locationState, triedLowerCase);
          return;
        });
      };
      if (!throwError || throwError === null || throwError === undefined) {
        addBlockLocation(FILE_LOCATION_TRY_PARTS, false);
      }
    } else {
      console.error(error);
      tooltip(error);
      if (partSpan && partSpan !== null && partSpan !== undefined) {
        partSpan.querySelector('img').setAttribute("src", originalPSImg);
      }
      if (throwError !== undefined) {
        throwError(error);
      }
    }

    // from ldrawloader
    // maybe fixes 404s stopping the script in palemoon and basilisk
    /*if ( fileName.startsWith( 's/' ) ) {
        fileName = 'parts/' + fileName;
        addBlockV2(part, partColor, partPosition, partRotation, partSpan, originalPSImg, fileName, throwSuccess, throwError);
    } else if ( fileName.startsWith( '48/' ) ) {
        fileName = 'p/' + fileName;
        addBlockV2(part, partColor, partPosition, partRotation, partSpan, originalPSImg, fileName, throwSuccess, throwError);
    } else {
        fileName = fileName;
        addBlockV2(part, partColor, partPosition, partRotation, partSpan, originalPSImg, fileName, throwSuccess, throwError);
    }*/
  });
}

function throwSuccess() {
  console.log('This is a success callback used so the browser console doesn\'t throw a fit.');
}
function throwError() {
  console.log('This is an throwError callback used so the browser console doesn\'t throw a fit.');
}
function spanImg(original_img, span) {
  if (partSpan && partSpan !== null && partSpan !== undefined) {
    partSpan.querySelector('img').setAttribute("src", originalPSImg);
  }
  console.log(partSpan);
}
function getBLItems() {
  var items = [];
  scene.traverse(function (obj) {
    var _obj$userData2, _obj$userData3;
    if (obj !== null && obj !== void 0 && obj.isMesh || obj !== null && obj !== void 0 && (_obj$userData2 = obj.userData) !== null && _obj$userData2 !== void 0 && _obj$userData2.isBlock || obj !== null && obj !== void 0 && (_obj$userData3 = obj.userData) !== null && _obj$userData3 !== void 0 && _obj$userData3.ldraw) {
      var _obj$userData4, _obj$parent, _obj$parent$userData;
      if (obj !== null && obj !== void 0 && (_obj$userData4 = obj.userData) !== null && _obj$userData4 !== void 0 && _obj$userData4.fileName || obj !== null && obj !== void 0 && (_obj$parent = obj.parent) !== null && _obj$parent !== void 0 && (_obj$parent$userData = _obj$parent.userData) !== null && _obj$parent$userData !== void 0 && _obj$parent$userData.fileName) {
        items.push(obj);
      }
    }
  });
  return items;
}
function updateBLItems() {
  var items = getBLItems();
  var blockList = document.getElementById('block-list');
  blockList.innerHTML = "";
  items.forEach(function (obj) {
    var item = renderBLItem(obj, 0);
    blockList.appendChild(item);
  });
}
function renderBLItem(obj) {
  var _obj$material3, _obj$material3$color, _obj$material3$color$, _obj$material4, _obj$material4$color, _obj$material4$color$;
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var id = obj.uuid;
  var color = ((_obj$material3 = obj.material) === null || _obj$material3 === void 0 ? void 0 : (_obj$material3$color = _obj$material3.color) === null || _obj$material3$color === void 0 ? void 0 : (_obj$material3$color$ = _obj$material3$color.toName) === null || _obj$material3$color$ === void 0 ? void 0 : _obj$material3$color$.call(_obj$material3$color)) || '#' + ((_obj$material4 = obj.material) === null || _obj$material4 === void 0 ? void 0 : (_obj$material4$color = _obj$material4.color) === null || _obj$material4$color === void 0 ? void 0 : (_obj$material4$color$ = _obj$material4$color.getHexString) === null || _obj$material4$color$ === void 0 ? void 0 : _obj$material4$color$.call(_obj$material4$color)) || "No material";
  var part;
  if (obj.userData.isBlock && obj.userData.ldraw) {
    var _obj$userData5, _obj$parent2, _obj$parent2$userData;
    part = "Part ".concat((obj === null || obj === void 0 ? void 0 : (_obj$userData5 = obj.userData) === null || _obj$userData5 === void 0 ? void 0 : _obj$userData5.fileName) || (obj === null || obj === void 0 ? void 0 : (_obj$parent2 = obj.parent) === null || _obj$parent2 === void 0 ? void 0 : (_obj$parent2$userData = _obj$parent2.userData) === null || _obj$parent2$userData === void 0 ? void 0 : _obj$parent2$userData.fileName));
  }
  var li = document.createElement('li');
  li.classList.add('scene-block-item');
  li.setAttribute('data-id', id);
  li.textContent = "".concat(part, " (").concat(color, ")");
  if (obj.children && obj.children.length > 0) {
    var ul = document.createElement('ul');
    obj.children.forEach(function (child) {
      if (child.isMesh || child.isGroup) {
        var childLi = renderBLItem(child, level + 1);
        ul.appendChild(childLi);
      }
    });
    li.appendChild(ul);
  }
  return li;
}
function subobjectPosition(g) {
  g.updateMatrixWorld(true);
  var position = new THREE.Vector3();
  var quaternion = new THREE.Quaternion();
  var scale = new THREE.Vector3();
  g.matrixWorld.decompose(position, quaternion, scale);
  var m = g.clone();
  m.position.copy(position);
  m.quaternion.copy(quaternion);
  m.scale.copy(scale);
  m.updateMatrix();
  return m;
}
function objectSize(obj) {
  if (!obj) {
    return new THREE.Vector3(0, 0, 0);
  }
  var b = new THREE.Box3().setFromObject(obj);
  var s = new THREE.Vector3();
  b.getSize(s);
  return s;
}
function isSmall(g, scale) {
  var boundingBox = new THREE.Box3().setFromObject(g);
  var size = new THREE.Vector3();
  boundingBox.getSize(size);
  return size.x < scale || size.y < scale || size.z < scale;
}
function generateUVMap(geometry) {
  geometry.computeBoundingBox();
  geometry.computeVertexNormals();
  var uvs = [];
  var position = geometry.attributes.position;
  var box = geometry.boundingBox;
  for (var i = 0; i < position.count; i++) {
    var x = position.getX(i);
    var y = position.getY(i);
    var u = (x - box.min.x) / (box.max.x - box.min.x);
    var v = (y - box.min.y) / (box.max.y - box.min.y);
    uvs.push(u, v);
  }
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  return geometry;
}
function getPriceInfo() {
  if (selectedObject) {
    var _part = selectedObject.parent.userData.fileName.replace("parts/", "").replace(".dat", "");
    fetch("parts.php?part_price=true&part=".concat(_part)).then(function (res) {
      return res.json();
    }).then(function (data) {
      var _data$part_prices, _data$part_prices$USD;
      var price = (_data$part_prices = data.part_prices) === null || _data$part_prices === void 0 ? void 0 : (_data$part_prices$USD = _data$part_prices.USD) === null || _data$part_prices$USD === void 0 ? void 0 : _data$part_prices$USD["new"];
      if (price !== undefined) {
        console.log("new price in united states dollars: $" + price);
      } else {
        console.warn("price data unavailable for ".concat(_part));
      }
    });
  }
}
function getFilename(obj) {
  if (obj) {
    while (obj) {
      if (obj.userData) {
        if (obj.userData.fileName) {
          return obj.userData.fileName;
        }
      }
      obj = obj.parent;
    }
    return null;
  }
}
function duplicatePart() {
  if (selectedObject) {
    part = "parts/".concat(selectedObject.userData.parentName);
    partName = selectedObject.userData.parentName;
    partColor = "#".concat(selectedObject.material.color.getHexString().toLowerCase());
    addBlock();
  }
}
function createGroup(gname, gelm) {
  var group = new THREE.Group();
  group.name = gname;
  group.add(gelm);
  return group;
}
document.getElementById("part-library-filter").addEventListener("change", function () {
  var new_ldraw_path = this.value;
  ldraw_loader.setPath(new_ldraw_path);
  ldraw_loader.setPartsLibraryPath(new_ldraw_path);
});

/* function generateSceneJSON() {
let sceneData = {
    metadata: {
    file_version: 1.2,
    name: "My Model",
    description: null
    },
    camera: camera.position,
    blocks: []
};

if (selectedObject) {
    transformControls.detach(selectedObject);
    selectedObject = null;
}

blockGroups.forEach(function (group) {
    if (!group || !group.userData.partName) {
    return;
    }

    let group_color = null;
    let mesh_child = null;

    let pos = new THREE.Vector3();
    let rot = new THREE.Quaternion();
    let scale = new THREE.Vector3();
    let euler = new THREE.Euler();

    group.traverse(function (child) {
    if (child.isMesh) {
        // saving the child object because using the group itself doesn't work
        // todo update block groups in the updateSceneData() function
        // 6/14/2025
        mesh_child = child;
        
        mesh_child.updateMatrixWorld(true);
        mesh_child.getWorldPosition(pos);
        mesh_child.getWorldQuaternion(rot);
        mesh_child.getWorldScale(scale);
        euler.setFromQuaternion(rot);
        
        if (Array.isArray(child.material)) {
        mesh_color = child.material[0].color.getHexString().toLowerCase();
        } else {
        mesh_color = child.material.color.getHexString().toLowerCase();
        }
    }
    });

    const blockData = {
    partName: group.userData.partName,
    color: mesh_color || 'c91a09',

    // use matrixes because child objects only store local location values and not global ones
    position: {
        x: pos.x,
        y: pos.y,
        z: pos.z
    },
    rotation: {
        x: euler.x,
        y: euler.y,
        z: euler.z
    },
    scale: {
        x: scale.x,
        y: scale.y,
        z: scale.z
    },
    blockID: group.name,
    //ldraw: group.ldraw.replace("parts/", ""),
    ldraw: mesh_child.userData.ldraw,
    };

    sceneData.blocks.push(blockData);
});

return JSON.stringify(sceneData, null, 2);
} */

function generateSceneJSON() {
  var sceneData = {
    metadata: {
      file_version: 1.2,
      name: "My Model",
      description: null
    },
    camera: camera.position,
    settings: JSON.stringify(scene.userData),
    blocks: []
  };

  /*if (selectedObject && transformControls) {
      transformControls.detach(selectedObject);
      selectedObject = null;
  }*/

  blockGroups.forEach(function (group) {
    if (!group) {
      return;
    }
    var meshes = [];
    group.traverse(function (child) {
      if (child.isMesh && child.userData.isBlock) {
        meshes.push(child);
      }
    });
    meshes.forEach(function (mesh_child) {
      var pos = new THREE.Vector3();
      var rot = new THREE.Quaternion();
      var scale = new THREE.Vector3();
      var euler = new THREE.Euler();
      mesh_child.updateMatrixWorld(true);
      mesh_child.getWorldPosition(pos);
      mesh_child.getWorldQuaternion(rot);
      mesh_child.getWorldScale(scale);
      euler.setFromQuaternion(rot);

      // Colors

      //one is usually the index for most of the part that isn't a texture
      if (Array.isArray(mesh_child.material)) {
        mesh_color = mesh_child.material[1].color.getHexString().toLowerCase();
      } else {
        mesh_color = mesh_child.material.color.getHexString().toLowerCase();
      }
      var blockData = {
        color: mesh_color,
        position: {
          x: pos.x,
          y: pos.y,
          z: pos.z
        },
        rotation: {
          x: euler.x,
          y: euler.y,
          z: euler.z
        },
        scale: {
          x: scale.x,
          y: scale.y,
          z: scale.z
        },
        id: mesh_child.userData.id || mesh_child.uuid,
        ldraw: mesh_child.userData.ldraw.replace("parts/", "")
      };
      sceneData.blocks.push(blockData);
    });
  });
  return JSON.stringify(sceneData);
}
function generateSceneLXFML() {
  var sceneBricks = '';
  var boneRefs = [];
  var refID = 0;
  var totalPosition = new THREE.Vector3();
  var count = 0;
  if (selectedObject) {
    transformControls.detach(selectedObject);
    selectedObject = null;
  }
  var lego_color_map = {
    "C91A09": 21,
    // Bright Red
    "F8CC00": 24,
    // Bright Yellow
    "0020A0": 23,
    // Bright Blue
    "005700": 28,
    // Dark Green
    "FE8A18": 25,
    // Bright Orange
    "D941BB": 221,
    // Bright Violet

    "000000": 26,
    // Black
    "FFFFFF": 1,
    // White
    "747371": 199,
    // Dark Bluish Grey
    "A3A2A4": 208,
    // Light Bluish Grey
    "958A73": 2,
    // Brick Yellow
    "6C5C4D": 86,
    // Dark Brown

    "812A00": 120,
    // Reddish Brown
    "5883C1": 102,
    // Medium Blue
    "4B974B": 151,
    // Sand Green
    "A52A2A": 59,
    // Dark Red
    "B36D2C": 106,
    // Dark Orange
    "FCB7BC": 104,
    // Bright Pink

    "60C0E0": 107,
    // Bright Light Blue
    "FBE696": 103,
    // Light Yellow
    "84B68D": 37,
    // Bright Green
    "92B28B": 34,
    // Bright Yellowish Green
    "002A5A": 140,
    // Dark Blue
    "DDDD22": 334 // Vibrant Yellow (sometimes 24 is used)
  };

  blockGroups.forEach(function (group) {
    group.traverse(function (child) {
      if (child.isMesh) {
        totalPosition.add(group.position);
        count++;
      }
    });
  });
  blockGroups.forEach(function (group) {
    var mesh_child = null;
    group.traverse(function (child) {
      if (child.isMesh) {
        mesh_child = child;
      }
    });
    if (mesh_child) {
      var ldraw = group.ldraw.replace("parts/", "").replace(".dat", "");
      var boneID = refID;
      var colorID = 21;
      if (!mesh_child.material.map && !mesh_child.isLineSegments) {
        var _lego_color_map$hex;
        var hex = mesh_child.material.color.getHexString().toUpperCase();
        colorID = (_lego_color_map$hex = lego_color_map[hex]) !== null && _lego_color_map$hex !== void 0 ? _lego_color_map$hex : 26;
      }
      var adjustedMatrix = mesh_child.matrixWorld.clone();
      var globalrot = new THREE.Matrix4().makeRotationX(Math.PI / 1);
      adjustedMatrix.premultiply(globalrot);
      var flipmatrix = new THREE.Matrix4().makeRotationX(Math.PI);
      adjustedMatrix.multiply(flipmatrix);
      var translationMatrix = new THREE.Matrix4().makeTranslation(-20, 0, 0); // 1 LDU
      adjustedMatrix.multiply(translationMatrix);
      sceneBricks += "\n                <Brick refID=\"".concat(refID, "\" designID=\"").concat(ldraw, "\" itemNos=\"").concat(ldraw, "\">\n                <Part refID=\"").concat(refID, "\" designID=\"").concat(ldraw, "\" materials=\"").concat(colorID, ",0\" decoration=\"0\">\n                    <Bone refID=\"").concat(refID, "\" transformation=\"").concat(LXFMLMatrix(adjustedMatrix), "\"></Bone>\n                </Part>\n                </Brick>");
      boneRefs.push(boneID);
      refID++;
    }
  });
  var boneRefString = boneRefs.join(',');
  var sceneData = "\n            <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>\n            <LXFML versionMajor=\"5\" versionMinor=\"0\" name=\"Imported GR8BRIK Creation\">\n            <Meta>\n                <Application name=\"LEGO Digital Designer\" versionMajor=\"4\" versionMinor=\"3\"/>\n                <Brand name=\"LDD\"/>\n                <BrickSet version=\"2670\"/>\n            </Meta>\n            <Model name=\"Imported GR8BRIK Creation\"></Model>\n            <Cameras>\n                <Camera refID=\"0\" fieldOfView=\"80\" distance=\"120\" transformation=\"1,0,0,0,1,0,0,0,1,0,0,120\"/>\n            </Cameras>\n            <Bricks cameraRef=\"0\">\n                ".concat(sceneBricks, "\n            </Bricks>\n            <RigidSystems>\n                <RigidSystem>\n                <Rigid refID=\"0\" transformation=\"1,0,0,0,1,0,0,0,1,0,0,0\" boneRefs=\"").concat(boneRefString, "\"/>\n                </RigidSystem>\n            </RigidSystems>\n            <GroupSystems>\n                <GroupSystem></GroupSystem>\n            </GroupSystems>\n            <BuildingInstructions></BuildingInstructions>\n            </LXFML>\n        ");
  return sceneData.replace(/\s+/g, ' ').trim();
}
function LXFMLMatrix(matrix4) {
  var unit = 0.04;
  var converted = matrix4.clone();
  var rotx = new THREE.Matrix4().makeRotationX(Math.PI / 1);
  var rot = new THREE.Matrix4();
  rot.multiply(rotx);
  converted.premultiply(rot);
  var position = new THREE.Vector3();
  var quaternion = new THREE.Quaternion();
  var scale = new THREE.Vector3();
  converted.decompose(position, quaternion, scale);
  position.multiplyScalar(unit);
  position.x -= 0.8;
  converted.compose(position, quaternion, scale);
  var elm = converted.transpose().elements;
  return [elm[0], elm[4], elm[8],
  // X
  elm[1], elm[5], elm[9],
  // Y
  elm[2], elm[6], elm[10],
  // Z
  elm[3], elm[7], elm[11] // position
  ].map(function (v) {
    return v.toFixed(10);
  }).join(',');
}
function updateSceneData() {
  if (blockGroups && blockGroups.length > 0) {
    blockGroups.forEach(function (g) {
      g.updateMatrixWorld(true);
      var hasTinyMesh = false;
      g.traverse(function (child) {
        child.updateMatrixWorld(true);
        if (child.isMesh && isSmall(child, 19)) {
          hasTinyMesh = true;
        }
      });
      g.userData.noSnap = hasTinyMesh;

      /*if (!g.userData.noSnap || !scene.userData.noSnap) {
          g.position.set(
              snapToGrid(g.position.x, 10),
              snapToGrid(g.position.y, 4),
              snapToGrid(g.position.z, 10)
          );
      } */
    });

    scene.updateMatrixWorld(true);
  }
  if (selectedObject) {
    selectedObject.updateMatrixWorld(true);
  }
  if (scene.children.length != 0) {
    autosave();
  }
}
function autosave() {
  var jsonData = generateSceneJSON();
  var date = new Date();
  date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
  document.cookie = "localsave=" + JSON.stringify(JSON.parse(jsonData)) + "; expires=" + date.toUTCString();
}
function read_autosave() {
  var saved = getCookie("localsave");
  if (saved) {
    try {
      var parsed = JSON.parse(saved);
      loadSceneFromJSON(parsed);
      camera.position.x = parsed.camera.x;
      camera.position.y = parsed.camera.y;
      camera.position.z = parsed.camera.z;
      //scene.userData = parsed.settings;
      console.log(parsed.camera);
    } catch (e) {
      console.warn("failed to load autosave " + e);
    }
  }
}
function clear_autosave() {
  var saved = getCookie("localsave");
  if (saved) {
    try {
      var parsed = JSON.parse(saved);
      parsed.blocks = null;
      parsed.camera = null;
      var date = new Date();
      date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
      document.cookie = "localsave=" + JSON.stringify(parsed) + "; expires=" + date.toUTCString();
      tooltip('Cleared autosave');
    } catch (e) {
      console.warn("failed to load autosave " + e);
    }
  }
}
function read_settings() {
  var saved = getCookie("setting");
  if (saved) {
    try {
      scene.userData = JSON.parse(saved);
    } catch (e) {
      console.warn("failed to load settings " + e);
    }
  }
}
read_settings();
function save_settings() {
  var jsonData = JSON.stringify(scene.userData);
  var date = new Date();
  date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
  document.cookie = "setting=" + jsonData + "; expires=" + date.toUTCString();
}
function clear_settings() {
  var saved = getCookie("setting");
  if (saved) {
    try {
      var parsed = JSON.parse(saved);
      var date = new Date();
      date.setTime(date.getTime() - 365 * 24 * 60 * 60 * 1000);
      document.cookie = "setting=" + JSON.stringify(parsed) + "; expires=" + date.toUTCString();
      tooltip('Cleared settings');
    } catch (e) {
      console.warn("failed to load settings " + e);
    }
  }
}

/* 
Clone mesh data and not anything like transform controls because idk how to remove it
*/
/* function clone_mesh_clean(obj) {
    if (!obj.isMesh) { 
        return null;
    }

    const mat = obj.material.clone();
    const geometry = obj.geometry.clone();

    const obj_clone = new THREE.Mesh(geometry, mat);
    obj_clone.position.copy(obj.position);
    obj_clone.rotation.copy(obj.rotation);
    obj_clone.scale.copy(obj.scale);
    obj_clone.name = obj.name;

    return obj_clone;
} */

function clone_mesh_clean(obj) {
  if (!obj.isMesh || !obj.geometry) {
    return null;
  }
  var mat;
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      mat = obj.material.map(function (m) {
        return m.clone();
      });
    } else {
      mat = obj.material.clone();
    }
  } else {
    mat = new THREE.MeshLambertMaterial();
  }
  var geometry = obj.geometry.clone();
  geometry.name = obj.name || 'mesh';
  var obj_clone = new THREE.Mesh(geometry, mat);
  obj.updateMatrixWorld(true);
  obj.getWorldPosition(obj_clone.position);
  obj.getWorldQuaternion(obj_clone.quaternion);
  obj.getWorldScale(obj_clone.scale);
  obj_clone.name = obj.name || 'clone';
  return obj_clone;
}

/* function normalize_color(color) {
    if(!color) {
    return;
    }

    let r = color.r;
    let g = color.g;
    let b = color.b;

    const max_rgb = Math.max(r, g, b);
    if (max_rgb < 0.1) {
    const boost = 1.0 / max_rgb;
    r = Math.min(1.0, r * boost);
    g = Math.min(1.0, g * boost);
    b = Math.min(1.0, b * boost);
    }

    return new THREE.Color(r, g, b);
} */

/*function brighten_color(color) {
    // 0.6 is brightness
    return new THREE.Color(
    Math.max(color.r, 0.6),
    Math.max(color.g, 0.6),
    Math.max(color.b, 0.6)
    );
} */

function filter_objects_peices() {
  var thumb = new THREE.Scene();
  scene.traverse(function (object) {
    if (object.isMesh && object.userData.isBlock) {
      var _object$material, _object$material2;
      var hexColor = ((_object$material = object.material) === null || _object$material === void 0 ? void 0 : _object$material.color) || ((_object$material2 = object.material) === null || _object$material2 === void 0 ? void 0 : _object$material2.map) || new THREE.Color(0xffffff);
      var cloned = clone_mesh_clean(object);
      if (cloned) {
        if (cloned.material && cloned.material.color && selectedExport === "dae") {
          apply_vertex_from_hex(cloned, hexColor);
          cloned.material.vertexColors = true;
        } else if (cloned.material && Array.isArray(cloned.material)) {
          cloned.material.forEach(function (mat) {
            if (mat !== null && mat !== void 0 && mat.color) {
              mat.color = mat.color.getHexString();
            }
          });
        } else {
          cloned.material = new THREE.MeshPhysicalMaterial({
            color: hexColor,
            metalness: 0,
            roughness: 1
          });
        }
        thumb.add(cloned);
        cloned.rotation.setFromQuaternion(cloned.quaternion);
      }
    }
  });
  return thumb;
}
function apply_vertex_from_hex(mesh, hex) {
  var geometry = mesh.geometry;
  var color = new THREE.Color(hex);
  var count = geometry.attributes.position.count;
  var colors = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    colors[i * 3 + 0] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(function (mat) {
      return mat.vertexColors = true;
    });
  } else {
    mesh.material.vertexColors = true;
  }
}
function generate_missing() {
  var geo = new THREE.BoxGeometry(10, 10, 10);
  var mat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true
  });
  return new THREE.Mesh(geo, mat);
}

/* function updateMaterials() {
    if(!selectedObject) {
    return;
    }

    displayedColors = document.getElementById("obj-colors");
    displayedColors.innerHTML = "";

        selectedObject.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
        child.material.forEach((mat, index) => {
            console.log(mat);
            if (mat && mat.color instanceof THREE.Color && typeof mat.color.getHexString === "function") {
            const colorHex = `#${mat.color.getHexString()}`;
            const span = document.createElement("span");
            console.log(`Subpart ${index}: ${colorHex}`);
            span.style.backgroundColor = colorHex;
            span.style.padding = "2px 2px 2px 2px";
            displayedColors.appendChild(span);
            }
        });
                }
            }
        });
    updateSceneData();
} */

window.addEventListener('pointerdown', function (event) {
  var target = event.target;
  var container = document.querySelector(".scene");
  var rect = container.getBoundingClientRect();
  if (!container.contains(target)) {
    return;
  }
  mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children.filter(function (obj) {
    return obj.visible;
  }), true);
  if (intersects.length > 0) {
    selectObject(intersects[0].object);
  } else {
    deselect(selectedObject);
  }
});
function selectObject(obj) {
  var _obj, _obj$material5, _obj$material5$color, _obj2, _obj2$material$, _obj2$material$$color;
  while (obj.parent && !obj.userData.isBlock) {
    obj = obj.parent;
  }
  if (!obj.userData.isBlock && transformControls.enabled) {
    return;
  }
  if (obj === selectedObject) {
    return;
  }
  transformControls.detach(selectedObject);
  selectedObject = null;
  transformControls.attach(obj);
  selectedObject = obj;
  partColor = "#".concat((_obj = obj) === null || _obj === void 0 ? void 0 : (_obj$material5 = _obj.material) === null || _obj$material5 === void 0 ? void 0 : (_obj$material5$color = _obj$material5.color) === null || _obj$material5$color === void 0 ? void 0 : _obj$material5$color.getHexString()) || "#".concat((_obj2 = obj) === null || _obj2 === void 0 ? void 0 : (_obj2$material$ = _obj2.material[1]) === null || _obj2$material$ === void 0 ? void 0 : (_obj2$material$$color = _obj2$material$.color) === null || _obj2$material$$color === void 0 ? void 0 : _obj2$material$$color.getHexString()) || '#ffffff';
  $("#color-picker").spectrum("set", partColor);
}
function deselect(obj) {
  transformControls.detach(obj);
  selectedObject = null;
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function moveBlock(mode) {
  if (mode === "t") {
    transformControls.setMode('translate');
    tooltip('Changed to drag parts');
  }
  if (mode === "r") {
    transformControls.setMode('rotate');
    tooltip('Changed to rotate parts');
  }
  if (mode === "s") {
    transformControls.setMode('scale');
    tooltip('Changed to the secret scale parts');
  }
}
document.getElementById("resetCamera").addEventListener("click", function () {
  controls.reset();
  scene.updateMatrixWorld();
});

// Last refactor 6/3/2025 by susstevedev
function animate() {
  document.addEventListener('DOMContentLoaded', function () {
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.zIndex = '99999999';
    stats.domElement.style.left = '0px';
    stats.domElement.style.bottom = '0px';
    document.body.appendChild(stats.domElement);
    setInterval(function () {
      stats.update();
    }, 1000 / 60);
  });
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}
function tooltip(text) {
  var tooltip = document.createElement('div');
  tooltip.textContent = text;
  tooltip.setAttribute('id', 'tooltip');
  document.body.appendChild(tooltip);
  if (tooltip) {
    setTimeout(function () {
      setTimeout(function () {
        tooltip.remove();
      }, 500);
    }, 5000);
  }
}
window.onload = function () {
  setTimeout(function () {
    if (document.getElementById("preloaded-logo")) {
      document.getElementById("preloaded-logo").style.display = "none";
    }
  }, 1000);
};