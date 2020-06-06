import clone from '../utils/clone';

describe('clone', function () {
  it('should clone objects', function () {
    const foo = {
      username: 'aaa',
    };

    const cloned = clone(foo);

    foo.username = 'bbb';

    expect(foo.username === 'bbb').toBeTrue();
    expect(cloned.username === 'aaa').toBeTrue();
  });

  it('should clone arrays', function () {
    const foo = [
      {
        username: 'aaa',
      },
    ];

    const cloned = clone(foo);

    foo[0].username = 'bbb';

    expect(foo[0].username === 'bbb').toBeTrue();
    expect(cloned[0].username === 'aaa').toBeTrue();
  });

  it('should clone dates', function () {
    const NOW = Date.now();

    const foo = new Date(NOW);
    const cloned = clone(foo);

    // Should be the same date value
    expect(foo.getTime() === NOW).toBeTrue();
    expect(cloned.getTime() === NOW).toBeTrue();
    // Should be a different reference
    expect(foo !== cloned).toBeTrue();

    foo.setMinutes(10, 10, 10);
    // Value should have changed
    expect(foo.getTime() !== NOW).toBeTrue();
    // Cloned should not mutate
    expect(cloned.getTime() === NOW).toBeTrue();
  });


  it('should clone classes', function () {
    class CloneTest {
      test() { return 1; }
    };
    const foo = new CloneTest();
    foo.username = 'aaa';

    const cloned = clone(foo);

    foo.username = 'bbb';

    expect(foo.username === 'bbb').toBeTrue();
    expect(cloned.username === 'aaa').toBeTrue();

    expect(foo.test()).toBe(1);
    expect(cloned.test()).toBe(1);
    expect(foo).toEqual(jasmine.any(CloneTest));
    expect(cloned instanceof CloneTest).toBeTrue();
  });
});
