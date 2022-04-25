/* eslint-disable jest/no-done-callback */
import { atom, createAsyncSelector } from '..';
import { _ } from '../__test_helper/underscore';

const MS = 1;

const timeout = (f, ms, done) => {
  setTimeout(() => {
    try {
      f();
    } catch (e) {
      done(e);
    }
  }, ms);
};

it('is exported', () => {
  expect(typeof createAsyncSelector).toBe('function');
});

it('has basic functionality', (done) => {
  const a = atom(5);

  const [selector, load] = createAsyncSelector({
    id: 'test',
    inputs: [a],
    throttle: (f) => _.debounce(f, 10 * MS),
    func: async (n) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n + 1;
    },
    defaultValue: 10,
  });

  timeout(
    () => {
      expect(load.get()).toBe(false);
      expect(selector.get()).toBe(10);
      timeout(
        () => {
          expect(load.get()).toBe(true);
          expect(selector.get()).toBe(10);
          timeout(
            () => {
              expect(load.get()).toBe(false);
              expect(selector.get()).toBe(6);
              done();
            },
            20 * MS,
            done,
          );
        },
        5 * MS,
        done,
      );
    },
    5 * MS,
    done,
  );
});
