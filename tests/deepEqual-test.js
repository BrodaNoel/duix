import deepEqual from '../utils/deepEqual';

describe('deepEqual', function () {
  it('should compare numbers', function () {
    expect(deepEqual(1, 1)).toBeTrue();

    expect(deepEqual(1, 2)).toBeFalse();
    expect(deepEqual(1.1, 1)).toBeFalse();
  });

  it('should compare strings', function () {
    expect(deepEqual('', '')).toBeTrue();
    expect(deepEqual('a1', 'a1')).toBeTrue();

    expect(deepEqual('a1', '')).toBeFalse();
    expect(deepEqual('a1', 'a2')).toBeFalse();
    expect(deepEqual('1', 1)).toBeFalse();
  });

  it('should compare objects', function () {
    const o1 = {
      a: 1,
      b: 2,
      c: {
        d: 1,
      },
    };
    let o2;

    expect(deepEqual(null, null)).toBeTrue();
    expect(deepEqual({}, {})).toBeTrue();
    expect(deepEqual(o1, o1)).toBeTrue();
    o2 = JSON.parse(JSON.stringify(o1));
    expect(deepEqual(o1, o2)).toBeTrue();

    expect(deepEqual({}, null)).toBeFalse();
    expect(deepEqual(o1, null)).toBeFalse();
    expect(deepEqual(o1, {})).toBeFalse();

    o2 = JSON.parse(JSON.stringify(o1));
    o2.a = 100;
    expect(deepEqual(o1, o2)).toBeFalse();

    o2 = JSON.parse(JSON.stringify(o1));
    o2.c.e = '+';
    expect(deepEqual(o1, o2)).toBeFalse();

    o2 = JSON.parse(JSON.stringify(o1));
    delete o2.c.d;
    expect(deepEqual(o1, o2)).toBeFalse();
  });

  it("should compare array's", function () {
    const a1 = [1, 2, 3];
    let a2 = [];

    expect(deepEqual([], [])).toBeTrue();
    expect(deepEqual(a1, a1)).toBeTrue();

    a2 = JSON.parse(JSON.stringify(a1));
    expect(deepEqual(a1, a2)).toBeTrue();

    a2 = JSON.parse(JSON.stringify(a1));
    a2.push(5);
    expect(deepEqual(a1, a2)).toBeFalse();

    a2 = JSON.parse(JSON.stringify(a1));
    a2.splice(1, 1);
    expect(deepEqual(a1, a2)).toBeFalse();
  });
});
