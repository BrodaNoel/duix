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

const _callsubscribers = (key, newValue, prevValue) => {
  store[key].subscribers.forEach(callback => {
    if (typeof callback === 'function') {
      callback(newValue, prevValue);
    }
  });
};

export default {
  set (key, value) {
    let currentValue = undefined;

    if (!store[key]) {
      store[key] = { value, subscribers: [] };
    } else {
      currentValue = store[key].value;
      store[key].value = value;
    }

    // TODO: Call callback only if the value really changed
    _callsubscribers(key, value, currentValue);
  },

  get(key) {
    return !store[key] ? undefined : store[key].value;
  },

  subscribe(key, callback, options = {}) {
    let index = 1;

    if (!store[key]) {
      store[key] = { value: undefined, subscribers: [ callback ] };
    } else {
      index = store[key].subscribers.push(callback);
    }

    if (options.callMeNow) {
      callback(this.get(key));
    }

    // This returns the unsubscribe handler
    return () => {
      delete store[key].subscribers[index - 1];
    };
  }
};
