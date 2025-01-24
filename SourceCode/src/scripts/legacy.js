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
  