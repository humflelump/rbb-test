import { atom, dynamicSelector } from '../index';

it('is exported', () => {
  expect(typeof dynamicSelector).toBe('function');
});

it('has basic get functionality', () => {
  const a = atom(5);
  const s = dynamicSelector({
    id: 'g',
    func: (get) => {
      return get(a) * 2;
    },
  });
  expect(s.get()).toBe(10);
});

it('works with a function as input', () => {
  const a = atom(5);
  const s = dynamicSelector((get) => get(a) * 2);
  expect(s.get()).toBe(10);
});

it('has basic memoization', () => {
  let calls = 0;
  const s = dynamicSelector(() => {
    calls++;
    return 1;
  });
  expect(calls).toBe(0);
  expect(s.get()).toBe(1);
  expect(calls).toBe(1);
  expect(s.get()).toBe(1);
  expect(calls).toBe(1);
});

it('has advanced memoization', () => {
  const a = atom({ data: 1, id: 'a' });
  const b = atom({ data: 2, id: 'b' });
  const c = atom(true);
  let calls = 0;
  const s = dynamicSelector((get) => {
    calls++;
    if (get(c)) {
      return get(a);
    } else {
      return get(b);
    }
  });
  expect(calls).toBe(0);
  expect(s.get()).toBe(1);
  expect(calls).toBe(1);
  expect(s.get()).toBe(1);
  expect(calls).toBe(1);
  b.set(100);
  expect(s.get()).toBe(1);
  expect(calls).toBe(1);
  c.set(false);
  expect(s.get()).toBe(100);
  expect(calls).toBe(2);
  a.set(100);
  expect(s.get()).toBe(100);
  expect(calls).toBe(2);
});

it('has an accessible id', () => {
  const s = dynamicSelector({
    id: 'g',
    func: () => null,
  });
  expect(s.getId()).toBe('g');
});

it('has a default id', () => {
  const s = dynamicSelector(() => null);
  expect(s.getId()).toBe('-');
});

it('has dynamic dependencies', () => {
  const a = atom(1);
  const b = atom(2);
  const c = atom(true);
  const d = dynamicSelector((get) => get(c));
  const s = dynamicSelector((get) => {
    if (get(d)) {
      return get(a);
    } else {
      return get(b);
    }
  });
  expect(s.getDependencies()).toEqual([]);
  expect(s.get()).toBe(1);
  expect(s.getDependencies().length).toBe(2);
  expect(s.getDependencies().includes(a)).toBe(true);
  expect(s.getDependencies().includes(d)).toBe(true);
  c.set(false);
  expect(s.get()).toBe(2);
  expect(s.getDependencies().length).toBe(2);
  expect(s.getDependencies().includes(b)).toBe(true);
  expect(s.getDependencies().includes(d)).toBe(true);
});

it('has dynamic dependents', () => {
  const a = atom({ data: 1, duplicate: true });
  const b = atom({ data: 2, duplicate: true });
  const c = atom({ data: true, duplicate: true });
  const d = dynamicSelector((get) => get(c));
  const s = dynamicSelector((get) => {
    if (get(d)) {
      return get(a);
    } else {
      return get(b);
    }
  });
  expect(d.getDependants('t')).toEqual([]);
  expect(s.getDependants('t')).toEqual([]);
  expect(d.get('t')).toBe(true);
  expect(d.getDependants('t')).toEqual([]);
  expect(s.getDependants('t')).toEqual([]);
  expect(c.getDependants('t')).toEqual([d]);
  expect(s.get('t')).toBe(1);
  expect(a.getDependants('t')).toEqual([s]);
  expect(b.getDependants('t')).toEqual([]);
  expect(c.getDependants('t')).toEqual([d]);
  expect(d.getDependants('t')).toEqual([s]);
  expect(s.getDependants('t')).toEqual([]);
  c.set(false, 't');
  expect(s.get('t')).toBe(2);
  expect(a.getDependants('t')).toEqual([]);
  expect(b.getDependants('t')).toEqual([s]);
  expect(c.getDependants('t')).toEqual([d]);
  expect(d.getDependants('t')).toEqual([s]);
  expect(s.getDependants('t')).toEqual([]);
});

it('can be subscribed to', () => {
  const a = atom({ data: 1, id: 'a' });
  const b = atom({ data: 2, id: 'b' });
  const c = atom({ data: true, id: 'c' });
  const s = dynamicSelector((get) => {
    if (get(c)) {
      return get(a);
    } else {
      return get(b);
    }
  });
  let calls = 0;
  const sub = () => {
    calls++;
  };
  s.subscribe(sub);
  expect(calls).toBe(0);

  // Why is sub() not called?
  // the selector doesn't register any dependencies until .get() is fired
  // This is fine because hooks should immediately call it
  a.set(100);
  expect(calls).toBe(0);
  a.set(1000);
  expect(calls).toBe(0);

  expect(s.get()).toBe(1000);
  expect(calls).toBe(0);

  a.set(1);
  expect(calls).toBe(1);
  a.set(1);
  expect(calls).toBe(1);

  c.set(false);
  expect(calls).toBe(2);
  a.set(10);
  expect(calls).toBe(2);

  c.subscribe(sub);
  expect(calls).toBe(2);

  c.set(true);
  expect(calls).toBe(3);
  c.unsubscribe(sub);
  c.set(false);
  expect(calls).toBe(4);

  s.unsubscribe(sub);
  c.set(true);
  expect(calls).toBe(4);
  a.set(123);
  b.set(123);
  c.set(false);
  expect(s.get()).toBe(123);
  expect(calls).toBe(4);
});

it('listens for subscription events', () => {
  let d1 = { next: null, curr: null };
  let d2 = { next: null, curr: null };
  const a = atom({
    data: 1,
    id: 'a',
    listenersChanged: (next, curr) => {
      d1 = { next, curr };
    },
  });
  const b = atom({
    data: 2,
    id: 'b',
    listenersChanged: (next, curr) => {
      d2 = { next, curr };
    },
  });
  const c = atom({ data: true, id: 'c' });
  const s1 = dynamicSelector({
    func: (get) => {
      if (get(c)) {
        return get(a);
      } else {
        return get(b);
      }
    },
    id: 's1',
  });
  const s2 = dynamicSelector({
    func: (get) => {
      return get(s1);
    },
    id: 's2',
  });
  let calls = 0;
  const sub = () => {
    calls++;
  };

  s2.subscribe(sub);
  expect(calls).toBe(0);
  expect(d1).toEqual({ next: null, curr: null });
  expect(d2).toEqual({ next: null, curr: null });
  expect(s2.get()).toBe(1);
  expect(d1).toEqual({ next: [sub], curr: [] });
  expect(d2).toEqual({ next: null, curr: null });
  expect(calls).toBe(0);

  c.set(false);
  expect(d1).toEqual({ next: [], curr: [sub] });
  expect(d2).toEqual({ next: [sub], curr: [] });
  expect(calls).toBe(1);
});

it('handles multiple selectors in the graph', () => {
  const a = atom({
    data: 1,
    id: 'a',
    duplicate: true,
    listenersChanged: (next, prev, key) => {
      d = { next, prev, key };
    },
  });
  const toggle = atom({ data: true, id: 'toggle', duplicate: true });
  let d: any = { next: null, prev: null, key: null };

  const sel1 = dynamicSelector({
    id: 'sel1',
    func: (get) => {
      if (get(toggle)) {
        return get(a);
      }
      return 42;
    },
  });

  const val2 = atom({
    data: 400,
    id: 'val2',
    duplicate: false,
  });
  const sel2 = dynamicSelector({
    id: 'sel2',
    func: (get) => {
      if (get(sel1) > 10) {
        return get(val2);
      }
      return 1000;
    },
  });

  let calls1 = 0;
  const f1 = () => {
    calls1++;
  };

  let calls2 = 0;
  const f2 = () => {
    calls2++;
  };

  sel2.subscribe(f1, 'key1');
  expect(d).toEqual({ next: null, prev: null, key: null });
  expect(sel2.get('key1')).toBe(1000);
  expect(d).toEqual({ next: [f1], prev: [], key: 'key1' });

  sel2.unsubscribe(f1, 'key1');
  expect(d).toEqual({ next: [], prev: [f1], key: 'key1' });

  sel2.subscribe(f1, 'key1');
  expect(d).toEqual({ next: [f1], prev: [], key: 'key1' });
  sel2.subscribe(f2, 'key2');
  expect(d).toEqual({ next: [f1], prev: [], key: 'key1' });
  sel2.get('key2');
  expect(d).toEqual({ next: [f2], prev: [], key: 'key2' });
  toggle.set(false, 'key2');
  expect(calls2).toBe(1);
  expect(d).toEqual({ next: [], prev: [f2], key: 'key2' });
  toggle.set(true, 'key2');
  expect(calls2).toBe(2);
  expect(d).toEqual({ next: [f2], prev: [], key: 'key2' });
  a.set(11, 'key2');
  expect(sel2.getDependencies('key2').includes(val2)).toBe(true);
  expect(sel2.getDependencies('key2').includes(sel1)).toBe(true);
  expect(sel2.getDependencies('key3')).toEqual([]);
});

it('handles singleton atoms', () => {
  const a = atom({ id: 'a', data: 5 });
  const toggle = atom({ id: 'toggle', data: true, duplicate: true });

  let memo1 = 0;
  let memo2 = 0;
  const sel1 = dynamicSelector((get) => {
    memo1++;
    if (get(toggle)) {
      return get(a);
    }
    return 1;
  });
  const sel2 = dynamicSelector((get) => {
    memo2++;
    if (get(toggle)) {
      return get(a);
    }
    return 2;
  });

  let calls1 = 0;
  let calls2 = 0;
  const f1 = () => {
    calls1++;
  };
  const f2 = () => {
    calls2++;
  };

  sel1.subscribe(f1, 'key1');
  sel2.subscribe(f2, 'key2');

  expect(sel1.get('key1')).toBe(5);
  expect(sel2.get('key2')).toBe(5);
  expect(memo1).toBe(1);
  expect(memo2).toBe(1);

  a.set(10);
  expect(calls1).toBe(1);
  expect(calls2).toBe(1);
  expect(memo1).toBe(2);
  expect(memo2).toBe(2);

  toggle.set(false, 'key1');
  expect(memo1).toBe(3);
  expect(memo2).toBe(2);
  expect(calls1).toBe(2);
  expect(calls2).toBe(1);

  a.set(15);
  expect(memo1).toBe(3);
  expect(memo2).toBe(3);
  expect(calls1).toBe(2);
  expect(calls2).toBe(2);
});
