/* eslint-disable jest/no-done-callback */
import { atom, createAction, createAsyncAction } from '..';
import { DEFAULT_STORE, Store } from '../core/Store';
import { injectKey } from '../functions/createAction';

const MS = 2;

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
  expect(typeof Store).toBe('function');
});

it('is has a default store', () => {
  expect(typeof DEFAULT_STORE).toBe('object');
});

it('can add and remove middleare on atoms', () => {
  const store = new Store();
  const a = atom({
    data: 1,
    store,
    id: 'a',
    duplicate: true,
  });

  let res = null;
  const middleware = (next, curr, atom, key) => {
    res = { next, curr, atomId: atom.id, key };
    return next;
  };
  store.addMiddleware(middleware);

  a.set(5);
  expect(res).toEqual({ next: 5, curr: 1, atomId: 'a', key: undefined });
  a.set(5, 'key1');
  expect(res).toEqual({ next: 5, curr: 1, atomId: 'a', key: 'key1' });
  a.set(1, 'key1');
  expect(res).toEqual({ next: 1, curr: 5, atomId: 'a', key: 'key1' });
  a.set(1, 'key1');
  expect(res).toEqual({ next: 1, curr: 1, atomId: 'a', key: 'key1' });

  res = null;
  store.removeMiddleware(middleware);
  a.set(100);
  expect(res).toEqual(null);
});

it('listens for action events', () => {
  const a = atom({ id: 'a', data: 5 });
  const b = atom({ id: 'b', data: 10 });
  const action = createAction({
    id: 'action',
    use: { a, b },
    func: (nodes) => (n: number) => {
      nodes.a.set(n);
      nodes.a.set(n);
      nodes.b.set(n + 1);
      nodes.b.set(n + 1);
      return n + 100;
    },
  });

  let res = null;
  const sub = (msg) => {
    res = msg;
  };
  DEFAULT_STORE.subscribe(sub);

  expect(res).toBe(null);
  action(20);
  expect(res.type).toEqual('ACTION_COMPLETED');
  expect(res.arguments).toEqual([20]);
  expect(res.returnVal).toEqual(120);
  expect(res.id).toEqual('action');
  expect(res.updates.length).toEqual(2);
  expect(res.updates.find((d) => d.atom === a).value).toEqual(20);
  expect(res.updates.find((d) => d.atom === b).value).toEqual(21);
  DEFAULT_STORE.unsubscribe(sub);
  res = null;
  action(30);
  expect(res).toBe(null);
});

it('listens for async action events', (done) => {
  const store = new Store();
  const a = atom({ data: 5, id: 'a', store });
  const [action] = createAsyncAction({
    id: 'async',
    use: { a },
    func: (nodes) => async (n: number) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      nodes.a.set(n);
      return n + 100;
    },
    store,
  });

  let res = null;
  const sub = (msg) => {
    res = msg;
  };
  store.subscribe(sub);

  action(12);
  timeout(
    () => {
      const callId = res.callId;
      expect(res.type).toEqual('ASYNC_ACTION_STARTED');
      expect(res.id).toEqual('async');
      expect(res.arguments).toEqual([12]);
      timeout(
        () => {
          expect(res.type).toEqual('ASYNC_ACTION_ENDED');
          expect(res.id).toEqual('async');
          expect(callId === res.callId).toEqual(true);
          expect(res.cancelled).toEqual(false);
          expect(res.hasError).toEqual(false);
          expect(res.returnVal).toEqual(112);
          expect(res.updates.length).toEqual(1);
          expect(res.updates.find((d) => d.atom === a).value).toEqual(12);
          done();
        },
        10 * MS,
        done,
      );
    },
    5 * MS,
    done,
  );
});

it('recieves 2 atoms per async action creation', (done) => {
  const store = new Store();

  const [helper] = createAsyncAction({
    id: 'async1',
    store,
    use: {},
    func: () => async () => {
      return true;
    },
  });

  const [action] = createAsyncAction({
    id: 'async2',
    store,
    use: { helper },
    func: (nodes) => async () => {
      await nodes.helper();
      return true;
    },
  });

  const a = injectKey(action, 'key1');
  const b = injectKey(action, 'key2');
  a();
  b();
  timeout(
    () => {
      const atoms = Object.values(store.getAllAtoms());
      expect(atoms.length).toBe(4);
      done();
    },
    2 * MS,
    done,
  );
});

it('listens for action cancellations', (done) => {
  const store = new Store();
  const [action] = createAsyncAction({
    id: 'async',
    use: {},
    func: () => async (n: number) => {
      await new Promise((res) => setTimeout(res, 10 * MS));
      return n;
    },
    store,
  });

  let res = null;
  const sub = (msg) => {
    res = msg;
  };

  store.subscribe(sub);
  action(42);
  timeout(
    () => {
      expect(res.type).toEqual('ASYNC_ACTION_STARTED');
      expect(res.arguments).toEqual([42]);
      action(100);
      timeout(
        () => {
          expect(res.type).toEqual('ASYNC_ACTION_STARTED');
          expect(res.arguments).toEqual([100]);
          timeout(
            () => {
              expect(res.type).toEqual('ASYNC_ACTION_ENDED');
              expect(res.cancelled).toEqual(true);
              expect(res.returnVal).toEqual(42);
              timeout(
                () => {
                  expect(res.type).toEqual('ASYNC_ACTION_ENDED');
                  expect(res.cancelled).toEqual(false);
                  expect(res.returnVal).toEqual(100);
                  done();
                },
                4 * MS,
                done,
              );
            },
            4 * MS,
            done,
          );
        },
        4 * MS,
        done,
      );
    },
    4 * MS,
    done,
  );
});
