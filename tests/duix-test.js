
import duix from '../index.js'

let ki = 0;

describe("duix", function () {
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
  })

  it('should send the value on the callback when setting it', function () {
    const k = 'k' + ki++;
    let res = false;
    let unsubscribe = duix.subscribe(k, (val) => {
      expect(val).toBe('555');
      res = true;
    })
    duix.set(k, '555');
    expect(res).toBeTruthy();
    unsubscribe();
  });

  it('should not call the callback if the value is set before', function (done) {
    const k = 'k' + ki++;
    duix.set(k, '123');
    let unsubscribe = duix.subscribe(k, (val) => {
      done.fail("callback has been called while registered after");
    })
    unsubscribe();
    done();
  });

  it('should unsubscribe', function (done) {
    const k = 'k' + ki++;
    let unsubscribe = duix.subscribe(k, (val) => {
      done.fail("callback has been called while unsubscribed");
    })
    unsubscribe();
    duix.set(k, '456');
    done();
  });

  it('should unsubscribe but keep the others', function (done) {
    const k = 'k' + ki++;
    let res = 0;
    let unsubscribe = duix.subscribe(k, (val) => {
      res += 10;
    })

    let unsubscribe2 = duix.subscribe(k, (val) => {
      done.fail("callback has been called while unsubscribed");
    })

    let unsubscribe3 = duix.subscribe(k, (val) => {
      res += 300;
    })

    unsubscribe2();
    duix.set(k, '456');
    expect(res).toBe(310);
    done();
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

  describe('with option callMeNow', function () {
    it('should send the stored value', function () {
      const k = 'k' + ki++;
      let res = false;
      duix.set(k, '123');
      let unsubscribe = duix.subscribe(k, (val) => {
        expect(val).toBe('123');
        res = true;
      }, { callMeNow: true });
      expect(res).toBeTruthy();
      unsubscribe();
    });
  });

  describe('with onChange', function () {
    it("with numbers", function () {
      const k = 'k' + ki++;
      let res = 0;
      let unsubscribe = duix.subscribe(k, (val) => {
        res++;
      }, {
        onlyOnChange: true
      })
      duix.set(k, 123);
      duix.set(k, 123);
      duix.set(k, 123);
      expect(res).toBe(1);
      unsubscribe();
    });
  });
});
