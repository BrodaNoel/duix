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
  store[key].subscribers.forEach(config => {
    if (!config.options.onlyOnChange || !deepEqual(newValue, prevValue)) {
      config.callback(newValue, prevValue);
    }
  });
};

// Thanks to https://stackoverflow.com/a/25456134/1954789
function deepEqual(x, y) {
  if (x === y) {
    return true;
  } else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length != Object.keys(y).length)
      return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop]))
          return false;
      }
      else {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}

export default {
  set(key, newValue) {
    let prevValue = undefined;

    if (!store[key]) {
      store[key] = { value: newValue, subscribers: [] };
    } else {
      prevValue = store[key].value;
      store[key].value = newValue;
    }

    _callsubscribers(key, newValue, prevValue);
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
      onlyOnChange: false,
      callMeNow: false,
      ...options
    };

    if (!store[key]) {
      store[key] = { value: undefined, subscribers: [{ callback, options }] };
    } else {
      index = store[key].subscribers.push({ callback, options });
    }

    if (options.callMeNow) {
      callback(this.get(key), undefined);
    }

    // This returns the unsubscribe handler
    return () => {
      delete store[key].subscribers[index - 1];
    };
  }
};
