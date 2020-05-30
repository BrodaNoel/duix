import deepEqual from './utils/deepEqual';

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

export default {
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
