
import duix from '../index.js'

const k1 = 'abc';
const k2 = 'def';

describe("duix", function () {
  it('should get the sent value, anytime we ask for it', function () {
    duix.set(k1, '123');
    expect(duix.get(k1)).toBe('123');
    expect(duix.get(k1)).toBe('123');
    expect(duix.get(k1)).toBe('123');
    expect(duix.get(k1)).toBe('123');
  });

  it('should send the value on the callback when setting it', function () {
    let res = false;
    let unsubscribe = duix.subscribe(k1, (val) => {
      expect(val).toBe('123');
      res = true;
    })
    duix.set(k1, '123');
    expect(res).toBeTruthy();
    unsubscribe();
  });

  it('should not call the callback if the value is set before', function (done) {
    duix.set(k1, '123');
    let unsubscribe = duix.subscribe(k1, (val) => {
      done.fail("callback has been called while registered after");
    })
    unsubscribe();
    done();
  });

  it('should unsubscribe', function (done) {
    let unsubscribe = duix.subscribe(k1, (val) => {
      done.fail("callback has been called while unsubscribed");
    })
    unsubscribe();
    duix.set(k1, '456');
    done();
  });

  describe('with multiple keys', function () {
    it('get/set', function () {
      duix.set(k1, '123');
      duix.set(k2, '345');
      expect(duix.get(k1)).toBe('123');
      expect(duix.get(k2)).toBe('345');
    });
  });

  describe('with option callMeNow', function () {
    it('should send the stored value', function () {
      let res = false;
      duix.set(k1, '123');
      let unsubscribe = duix.subscribe(k1, (val) => {
        expect(val).toBe('123');
        res = true;
      }, { callMeNow: true });
      expect(res).toBeTruthy();
      unsubscribe();
    })
  });
});
