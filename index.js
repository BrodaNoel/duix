import deepEqual from './utils/deepEqual.js';
import clone from './utils/clone.js';

let store = {};
/**
 * Manage a variable accross multiple files
 * The data is associated to a "key" (can be anything)
 */
export default {
  /**
   * Store data into the storage
   * @param {*} key - The key under which the value will be stored
   * @param {*} newValue - The associated data
   * @param {object} options
   * @param {boolean} [options.checkForChangesInTheValue=false] - If true, will call subscribers only if the value actually changed
   */
  set(key, newValue, options) {
    // Set the default options
    options = {
      checkForChangesInTheValue: true,
      ...options,
    };

    let prevValue = undefined;

    if (!store[key]) {
      // New key, let's create it and that's all.
      store[key] = { value: clone(newValue), subscribers: [] };
      return;
    }

    prevValue = store[key].value;
    if (options.checkForChangesInTheValue && deepEqual(newValue, prevValue)) {
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
