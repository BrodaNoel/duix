import duix from '../index.js';

let ki = 0;

describe('duix', function () {
  it('should get the sent value, anytime we ask for it', function () {
    const k = 'k' + ki++;
    duix.set(k, '123');
    expect(duix.get(k)).toBe('123');
    expect(duix.get(k)).toBe('123');
    expect(duix.get(k)).toBe('123');
    expect(duix.get(k)).toBe('123');
  });

  it('should handle special values', function () {
    const k = 'k' + ki++;
    duix.set(k);
    expect(duix.get(k)).toBeUndefined();

    duix.set(k, false);
    expect(duix.get(k)).toBeFalse();

    duix.set(k, 0);
    expect(duix.get(k)).toBe(0);

    expect(duix.get(k + 'anything_else')).toBeUndefined();
  });

  it('should send the value on the callback when setting it', function () {
    const k = 'k' + ki++;
    let res = false;
    let unsubscribe = duix.subscribe(k, val => {
      expect(val).toBe('555');
      res = true;
    });
    duix.set(k, '555');
    expect(res).toBeTruthy();
    unsubscribe();
  });

  it('should not call the callback if the value is set before', function (done) {
    const k = 'k' + ki++;
    duix.set(k, '123');
    let unsubscribe = duix.subscribe(k, val => {
      done.fail('callback has been called while registered after');
    });
    unsubscribe();
    done();
  });

  it('should unsubscribe', function (done) {
    const k = 'k' + ki++;
    let unsubscribe = duix.subscribe(k, val => {
      done.fail('callback has been called while unsubscribed');
    });
    unsubscribe();
    duix.set(k, '456');
    done();
  });

  it('should unsubscribe but keep the others', function (done) {
    const k = 'k' + ki++;
    let res = 0;
    let unsubscribe = duix.subscribe(k, val => {
      res += 10;
    });

    let unsubscribe2 = duix.subscribe(k, val => {
      done.fail('callback has been called while unsubscribed');
    });

    let unsubscribe3 = duix.subscribe(k, val => {
      res += 300;
    });

    unsubscribe2();
    duix.set(k, '456');
    expect(res).toBe(310);
    done();
  });

  it('should not mutate the state after set - Object', function () {
    const k = 'k' + ki++;
    const value = { username: 'aaa' };
    duix.set(k, value);

    // Here we try to mutate
    value.username = 'bbb';

    const notMutatedValue = duix.get(k);

    expect(notMutatedValue.username).toBe('aaa');
  });

  it('should not mutate the state after get - Object', function () {
    const k = 'k' + ki++;
    duix.set(k, { username: 'aaa' });
    const value = duix.get(k);

    // Here we try to mutate
    value.username = 'bbb';

    const notMutatedValue = duix.get(k);

    expect(notMutatedValue.username).toBe('aaa');
  });

  it('should not mutate the state after set - Array of Object', function () {
    const k = 'k' + ki++;
    const value = [{ username: 'aaa' }];
    duix.set(k, value);

    // Here we try to mutate
    value[0].username = 'bbb';

    const notMutatedValue = duix.get(k);

    expect(notMutatedValue[0].username).toBe('aaa');
  });

  it('should not mutate the state after get - Array of Object', function () {
    const k = 'k' + ki++;
    duix.set(k, [{ username: 'aaa' }]);
    const value = duix.get(k);

    // Here we try to mutate
    value[0].username = 'bbb';

    const notMutatedValue = duix.get(k);

    expect(notMutatedValue[0].username).toBe('aaa');
  });

  it('should not mutate the values on pre-subscriber call', function () {
    const k = 'k' + ki++;
    const value = { username: 'aaa' };
    duix.set(k, value);

    duix.subscribe(k, (newValue, prevValue) => {
      expect(newValue.username).toBe('bbb');
      expect(prevValue.username).toBe('aaa');
    });

    // Here we mutate what should be `prevValue` on the subscriber
    value.username = 'bbb';
    duix.set(k, value);
  });

  it('should not mutate the value on the subscriber function', function () {
    const k = 'k' + ki++;
    const value = { username: '' };
    duix.set(k, value);

    duix.subscribe(k, newValue => {
      // Here we try to mutate
      newValue.username = 'bbb';

      const actualValue = duix.get(k);
      expect(actualValue.username).toBe('aaa');
    });

    value.username = 'aaa';

    duix.set(k, value);
  });

  describe('with multiple keys', function () {
    it('get/set', function () {
      const k1 = 'k' + ki++;
      const k2 = 'k' + ki++;

      duix.set(k1, '123');
      duix.set(k2, '345');
      expect(duix.get(k1)).toBe('123');
      expect(duix.get(k2)).toBe('345');
    });
  });

  describe('with option fireImmediately', function () {
    it('should send the stored value', function () {
      const k = 'k' + ki++;
      let res = false;
      duix.set(k, '123');
      let unsubscribe = duix.subscribe(
        k,
        val => {
          expect(val).toBe('123');
          res = true;
        },
        { fireImmediately: true }
      );
      expect(res).toBeTruthy();
      unsubscribe();
    });
  });

  describe('with onChange', function () {
    it('with numbers', function () {
      const k = 'k' + ki++;
      let res = 0;
      let unsubscribe = duix.subscribe(
        k,
        val => {
          res++;
        },
        {
          onlyOnChange: true,
        }
      );
      duix.set(k, 123);
      duix.set(k, 123);
      duix.set(k, 123);
      expect(res).toBe(1);
      unsubscribe();
    });
  });
});
