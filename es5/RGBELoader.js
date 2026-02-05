"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
(function () {
  // https://github.com/mrdoob/three.js/issues/5552
  // http://en.wikipedia.org/wiki/RGBE_image_format
  var RGBELoader = /*#__PURE__*/function (_THREE$DataTextureLoa) {
    _inherits(RGBELoader, _THREE$DataTextureLoa);
    var _super = _createSuper(RGBELoader);
    function RGBELoader(manager) {
      var _this;
      _classCallCheck(this, RGBELoader);
      _this = _super.call(this, manager);
      _this.type = THREE.HalfFloatType;
      return _this;
    }

    // adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
    _createClass(RGBELoader, [{
      key: "parse",
      value: function parse(buffer) {
        var /* return codes for rgbe routines */
          //RGBE_RETURN_SUCCESS = 0,
          RGBE_RETURN_FAILURE = -1,
          /* default error routine.  change this to change error handling */
          rgbe_read_error = 1,
          rgbe_write_error = 2,
          rgbe_format_error = 3,
          rgbe_memory_error = 4,
          rgbe_error = function rgbe_error(rgbe_error_code, msg) {
            switch (rgbe_error_code) {
              case rgbe_read_error:
                console.error('THREE.RGBELoader Read Error: ' + (msg || ''));
                break;
              case rgbe_write_error:
                console.error('THREE.RGBELoader Write Error: ' + (msg || ''));
                break;
              case rgbe_format_error:
                console.error('THREE.RGBELoader Bad File Format: ' + (msg || ''));
                break;
              default:
              case rgbe_memory_error:
                console.error('THREE.RGBELoader: Error: ' + (msg || ''));
            }
            return RGBE_RETURN_FAILURE;
          },
          /* offsets to red, green, and blue components in a data (float) pixel */
          //RGBE_DATA_RED = 0,
          //RGBE_DATA_GREEN = 1,
          //RGBE_DATA_BLUE = 2,

          /* number of floats per pixel, use 4 since stored in rgba image format */
          //RGBE_DATA_SIZE = 4,

          /* flags indicating which fields in an rgbe_header_info are valid */
          RGBE_VALID_PROGRAMTYPE = 1,
          RGBE_VALID_FORMAT = 2,
          RGBE_VALID_DIMENSIONS = 4,
          NEWLINE = '\n',
          fgets = function fgets(buffer, lineLimit, consume) {
            var chunkSize = 128;
            lineLimit = !lineLimit ? 1024 : lineLimit;
            var p = buffer.pos,
              i = -1,
              len = 0,
              s = '',
              chunk = String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
            while (0 > (i = chunk.indexOf(NEWLINE)) && len < lineLimit && p < buffer.byteLength) {
              s += chunk;
              len += chunk.length;
              p += chunkSize;
              chunk += String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
            }
            if (-1 < i) {
              /*for (i=l-1; i>=0; i--) {
                  	byteCode = m.charCodeAt(i);
                  	if (byteCode > 0x7f && byteCode <= 0x7ff) byteLen++;
                  	else if (byteCode > 0x7ff && byteCode <= 0xffff) byteLen += 2;
                  	if (byteCode >= 0xDC00 && byteCode <= 0xDFFF) i--; //trail surrogate
                  }*/
              if (false !== consume) buffer.pos += len + i + 1;
              return s + chunk.slice(0, i);
            }
            return false;
          },
          /* minimal header reading.  modify if you want to parse more information */
          RGBE_ReadHeader = function RGBE_ReadHeader(buffer) {
            // regexes to parse header info fields
            var magic_token_re = /^#\?(\S+)/,
              gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
              exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
              format_re = /^\s*FORMAT=(\S+)\s*$/,
              dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,
              // RGBE format header struct
              header = {
                valid: 0,
                /* indicate which fields are valid */

                string: '',
                /* the actual header string */

                comments: '',
                /* comments found in header */

                programtype: 'RGBE',
                /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */

                format: '',
                /* RGBE format, default 32-bit_rle_rgbe */

                gamma: 1.0,
                /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */

                exposure: 1.0,
                /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */

                width: 0,
                height: 0 /* image dimensions, width/height */
              };

            var line, match;
            if (buffer.pos >= buffer.byteLength || !(line = fgets(buffer))) {
              return rgbe_error(rgbe_read_error, 'no header found');
            }

            /* if you want to require the magic token then uncomment the next line */
            if (!(match = line.match(magic_token_re))) {
              return rgbe_error(rgbe_format_error, 'bad initial token');
            }
            header.valid |= RGBE_VALID_PROGRAMTYPE;
            header.programtype = match[1];
            header.string += line + '\n';
            while (true) {
              line = fgets(buffer);
              if (false === line) break;
              header.string += line + '\n';
              if ('#' === line.charAt(0)) {
                header.comments += line + '\n';
                continue; // comment line
              }

              if (match = line.match(gamma_re)) {
                header.gamma = parseFloat(match[1]);
              }
              if (match = line.match(exposure_re)) {
                header.exposure = parseFloat(match[1]);
              }
              if (match = line.match(format_re)) {
                header.valid |= RGBE_VALID_FORMAT;
                header.format = match[1]; //'32-bit_rle_rgbe';
              }

              if (match = line.match(dimensions_re)) {
                header.valid |= RGBE_VALID_DIMENSIONS;
                header.height = parseInt(match[1], 10);
                header.width = parseInt(match[2], 10);
              }
              if (header.valid & RGBE_VALID_FORMAT && header.valid & RGBE_VALID_DIMENSIONS) break;
            }
            if (!(header.valid & RGBE_VALID_FORMAT)) {
              return rgbe_error(rgbe_format_error, 'missing format specifier');
            }
            if (!(header.valid & RGBE_VALID_DIMENSIONS)) {
              return rgbe_error(rgbe_format_error, 'missing image size specifier');
            }
            return header;
          },
          RGBE_ReadPixels_RLE = function RGBE_ReadPixels_RLE(buffer, w, h) {
            var scanline_width = w;
            if (
            // run length encoding is not allowed so read flat
            scanline_width < 8 || scanline_width > 0x7fff ||
            // this file is not run length encoded
            2 !== buffer[0] || 2 !== buffer[1] || buffer[2] & 0x80) {
              // return the flat buffer
              return new Uint8Array(buffer);
            }
            if (scanline_width !== (buffer[2] << 8 | buffer[3])) {
              return rgbe_error(rgbe_format_error, 'wrong scanline width');
            }
            var data_rgba = new Uint8Array(4 * w * h);
            if (!data_rgba.length) {
              return rgbe_error(rgbe_memory_error, 'unable to allocate buffer space');
            }
            var offset = 0,
              pos = 0;
            var ptr_end = 4 * scanline_width;
            var rgbeStart = new Uint8Array(4);
            var scanline_buffer = new Uint8Array(ptr_end);
            var num_scanlines = h;

            // read in each successive scanline
            while (num_scanlines > 0 && pos < buffer.byteLength) {
              if (pos + 4 > buffer.byteLength) {
                return rgbe_error(rgbe_read_error);
              }
              rgbeStart[0] = buffer[pos++];
              rgbeStart[1] = buffer[pos++];
              rgbeStart[2] = buffer[pos++];
              rgbeStart[3] = buffer[pos++];
              if (2 != rgbeStart[0] || 2 != rgbeStart[1] || (rgbeStart[2] << 8 | rgbeStart[3]) != scanline_width) {
                return rgbe_error(rgbe_format_error, 'bad rgbe scanline format');
              }

              // read each of the four channels for the scanline into the buffer
              // first red, then green, then blue, then exponent
              var ptr = 0,
                count = void 0;
              while (ptr < ptr_end && pos < buffer.byteLength) {
                count = buffer[pos++];
                var isEncodedRun = count > 128;
                if (isEncodedRun) count -= 128;
                if (0 === count || ptr + count > ptr_end) {
                  return rgbe_error(rgbe_format_error, 'bad scanline data');
                }
                if (isEncodedRun) {
                  // a (encoded) run of the same value
                  var byteValue = buffer[pos++];
                  for (var i = 0; i < count; i++) {
                    scanline_buffer[ptr++] = byteValue;
                  }
                  //ptr += count;
                } else {
                  // a literal-run
                  scanline_buffer.set(buffer.subarray(pos, pos + count), ptr);
                  ptr += count;
                  pos += count;
                }
              }

              // now convert data from buffer into rgba
              // first red, then green, then blue, then exponent (alpha)
              var l = scanline_width; //scanline_buffer.byteLength;
              for (var _i = 0; _i < l; _i++) {
                var off = 0;
                data_rgba[offset] = scanline_buffer[_i + off];
                off += scanline_width; //1;
                data_rgba[offset + 1] = scanline_buffer[_i + off];
                off += scanline_width; //1;
                data_rgba[offset + 2] = scanline_buffer[_i + off];
                off += scanline_width; //1;
                data_rgba[offset + 3] = scanline_buffer[_i + off];
                offset += 4;
              }
              num_scanlines--;
            }
            return data_rgba;
          };
        var RGBEByteToRGBFloat = function RGBEByteToRGBFloat(sourceArray, sourceOffset, destArray, destOffset) {
          var e = sourceArray[sourceOffset + 3];
          var scale = Math.pow(2.0, e - 128.0) / 255.0;
          destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
          destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
          destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
          destArray[destOffset + 3] = 1;
        };
        var RGBEByteToRGBHalf = function RGBEByteToRGBHalf(sourceArray, sourceOffset, destArray, destOffset) {
          var e = sourceArray[sourceOffset + 3];
          var scale = Math.pow(2.0, e - 128.0) / 255.0;

          // clamping to 65504, the maximum representable value in float16
          destArray[destOffset + 0] = THREE.DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 0] * scale, 65504));
          destArray[destOffset + 1] = THREE.DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 1] * scale, 65504));
          destArray[destOffset + 2] = THREE.DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 2] * scale, 65504));
          destArray[destOffset + 3] = THREE.DataUtils.toHalfFloat(1);
        };
        var byteArray = new Uint8Array(buffer);
        byteArray.pos = 0;
        var rgbe_header_info = RGBE_ReadHeader(byteArray);
        if (RGBE_RETURN_FAILURE !== rgbe_header_info) {
          var w = rgbe_header_info.width,
            h = rgbe_header_info.height,
            image_rgba_data = RGBE_ReadPixels_RLE(byteArray.subarray(byteArray.pos), w, h);
          if (RGBE_RETURN_FAILURE !== image_rgba_data) {
            var data, type;
            var numElements;
            switch (this.type) {
              case THREE.FloatType:
                numElements = image_rgba_data.length / 4;
                var floatArray = new Float32Array(numElements * 4);
                for (var j = 0; j < numElements; j++) {
                  RGBEByteToRGBFloat(image_rgba_data, j * 4, floatArray, j * 4);
                }
                data = floatArray;
                type = THREE.FloatType;
                break;
              case THREE.HalfFloatType:
                numElements = image_rgba_data.length / 4;
                var halfArray = new Uint16Array(numElements * 4);
                for (var _j = 0; _j < numElements; _j++) {
                  RGBEByteToRGBHalf(image_rgba_data, _j * 4, halfArray, _j * 4);
                }
                data = halfArray;
                type = THREE.HalfFloatType;
                break;
              default:
                console.error('THREE.RGBELoader: unsupported type: ', this.type);
                break;
            }
            return {
              width: w,
              height: h,
              data: data,
              header: rgbe_header_info.string,
              gamma: rgbe_header_info.gamma,
              exposure: rgbe_header_info.exposure,
              type: type
            };
          }
        }
        return null;
      }
    }, {
      key: "setDataType",
      value: function setDataType(value) {
        this.type = value;
        return this;
      }
    }, {
      key: "load",
      value: function load(url, onLoad, onProgress, onError) {
        function onLoadCallback(texture, texData) {
          switch (texture.type) {
            case THREE.FloatType:
            case THREE.HalfFloatType:
              texture.encoding = THREE.LinearEncoding;
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;
              texture.generateMipmaps = false;
              texture.flipY = true;
              break;
          }
          if (onLoad) onLoad(texture, texData);
        }
        return _get(_getPrototypeOf(RGBELoader.prototype), "load", this).call(this, url, onLoadCallback, onProgress, onError);
      }
    }]);
    return RGBELoader;
  }(THREE.DataTextureLoader);
  THREE.RGBELoader = RGBELoader;
})();