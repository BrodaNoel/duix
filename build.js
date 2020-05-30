(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.duix = factory());
}(this, (function () { 'use strict';

  // Thanks to https://stackoverflow.com/a/25456134/1954789
  const deepEqual = (x, y) => {
    // TODO: this will not handle cyclical references !
    // TODO: this does not check class name !

    if (x === y) {
      return true;
    }

    if (typeof x === 'object' && x !== null && typeof y === 'object' && y !== null) {
      if (Object.keys(x).length !== Object.keys(y).length) {
        return false;
      }

      for (const prop in x) {
        if (!y.hasOwnProperty(prop)) {
          return false;
        }
        if (!deepEqual(x[prop], y[prop])) {
          return false;
        }
      }

      return true;
    }

    return false;
  };

  /**
   * {
   *  user: {
   *    value: { id: 123, name: 'Noel' },
   *    subscribers: [
   *      () => {} // The callback function
   *    ]
   *  }
   * }
   */
  let store = {};

  var index = {
    set(key, newValue) {
      let prevValue = undefined;

      if (!store[key]) {
        // New key, let's create it and that's all.
        store[key] = { value: newValue, subscribers: [] };
        return;
      }

      prevValue = store[key].value;
      if (deepEqual(newValue, prevValue)) {
        // If we have a previous value, and if it is the same,
        // then we don't notify
        return;
      }
      store[key].value = newValue;

      store[key].subscribers.forEach(callback => callback(newValue, prevValue));
    },

    get(key) {
      return !store[key] ? undefined : store[key].value;
    },

    subscribe(key, callback, options = {}) {
      let index = 1;

      if (typeof callback !== 'function') {
        console.error(`Registering in duix for '${key}': Callback is not a function: `, callback);
      }

      // Set the default options
      options = {
        fireImmediately: false,
        ...options,
      };

      if (!store[key]) {
        store[key] = { value: undefined, subscribers: [] };
      }
      index = store[key].subscribers.push(callback);

      if (options.fireImmediately) {
        callback(this.get(key), undefined);
      }

      // This returns the unsubscribe handler
      return () => {
        delete store[key].subscribers[index - 1];
      };
    },
  };

  return index;

})));
