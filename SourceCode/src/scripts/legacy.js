if (!Array.from) {
    Object.defineProperty(Array, 'from', {
      value: function(input, mapFn, thisArg) {
        console.log(input);

        // Check if input is a Map
        if (input instanceof Map) {
          var arr = [];
          input.forEach(function(value, key) {
            arr.push(mapFn ? mapFn.call(thisArg, [key, value]) : [key, value]);
          });
          return arr;
        }

        // Check if input is a Set
        if (input instanceof Set) {
            var arr = [];
            input.forEach(function(value) {
            arr.push(mapFn ? mapFn.call(thisArg, value) : value);
            });
            return arr;
        }
        
        // Fallback for other array-like objects
        if (input && typeof input.length === 'number') {
          var arr = [];
          for (var i = 0; i < input.length; i++) {
            arr.push(mapFn ? mapFn.call(thisArg, input[i], i) : input[i]);
          }
          return arr;
        }
  
        throw new TypeError('Array.from requires an array-like object, Map, or Set');
      },
      configurable: true,
      writable: true,
    });
  }

  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          // Skip over if undefined or null
          for (var key in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, key)) {
              to[key] = nextSource[key];
            }
          }
        }
      }
      return to;
    };
  }
 
if (!Array.prototype.fill) {
Object.defineProperty(Array.prototype, 'fill', {
    value: function value(_value, start, end) {
    if (this == null) {
        throw new TypeError('Array.prototype.fill called on null or undefined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    var relativeStart = start === undefined ? 0 : start >> 0;
    var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
    var relativeEnd = end === undefined ? len : end >> 0;
    var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
    while (k < final) {
        O[k] = _value;
        k++;
    }
    return O;
    }
});
}