(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.duix = factory());
})(this, (function () { 'use strict';

  /**
   * Compare two elements and return true if they are 'equivalent'
   *
   * @param {*} - first element
   * @param {*} - second element
   * @returns {boolean} - true if objects are equivalents
   *
   * @see https://stackoverflow.com/a/25456134/1954789
   */
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
   * Clone
   *
   * @param {*} - element to be cloned
   * @returns {*} - cloned element
   *
   * @todo It'll work adequately as long as the data in the
   * objects and arrays form a tree structure. That is, there
   * isn't more than one reference to the same data in the
   * object.
   *
   * @see https://stackoverflow.com/q/728360/1815449
   */
  function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = Object.create(Object.getPrototypeOf(obj));
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  let store = {};
  /**
   * Manage a variable accross multiple files
   * The data is associated to a "key" (can be anything)
   */
  var index = {
    /**
     * Store data into the storage
     * @param {*} key: the key under wich the value will be stored
     * @param {*} newValue: the associated data
     */
    set(key, newValue) {
      let prevValue = undefined;

      if (!store[key]) {
        // New key, let's create it and that's all.
        store[key] = { value: clone(newValue), subscribers: [] };
        return;
      }

      prevValue = store[key].value;
      if (deepEqual(newValue, prevValue)) {
        // If we have a previous value, and if it is the same,
        // then we don't notify
        return;
      }
      store[key].value = clone(newValue);

      store[key].subscribers.forEach(callback => callback(clone(newValue), clone(prevValue)));
    },

    /**
     * Return the data associated to the key
     * @param {*} key
     */
    get(key) {
      return store[key] ? clone(store[key].value) : undefined;
    },

    /**
     *
     * @param {*} key - the key of the data
     * @param {function(any, any):void} callback - called when the data chagne
     * @param {object} options
     * @param {boolean} [options.fireImmediately=false] - if true, the callback is immediately fired with the last stored value
     * @returns {function(void):void} - Unregister the listener
     */
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

}));
