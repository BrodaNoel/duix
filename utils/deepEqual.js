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

export default deepEqual;
