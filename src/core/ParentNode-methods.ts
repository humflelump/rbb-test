import { NO_DUPE_KEY } from './constants';

export const parentMethods = {
  revokeHelper: function (visits, key) {
    if (key === NO_DUPE_KEY) {
      this.useCache = new Map(); // clear all
    } else {
      this.useCache.set(key, false);
    }
    this.getDependants(key).forEach((d) => d.revokeCache(visits, key));
  },

  revokeCache: function (visits, key) {
    if (visits.has(this)) return;
    visits.add(this);
    this.revokeHelper(visits, key);
  },

  disconnect: function (parent, key) {
    const countMap = this.listeners.get(key) || new Map();
    const parentKey = parent.notDupe() ? NO_DUPE_KEY : key;
    const parentCountMap = parent.listeners.get(parentKey) || new Map();
    for (const listener of countMap.keys()) {
      let count = Math.min(parentCountMap.get(listener) || 0, countMap.get(listener) || 0);
      while (count > 0) {
        parent.unsubscribe(listener, key);
        count--;
      }
    }
    this.dynDependencies.set(
      key,
      (this.dynDependencies.get(key) || []).filter((dep) => dep !== parent),
    );
    parent.dynDependants.set(
      key,
      (parent.dynDependants.get(key) || []).filter((dep) => dep !== this),
    );
  },

  connect: function (parent, key) {
    if (this.notDupe()) {
      key = NO_DUPE_KEY;
    }
    const countMap = this.listeners.get(key) || new Map();
    for (const listener of countMap.keys()) {
      let count = countMap.get(listener) || 0;
      while (count > 0) {
        parent.subscribe(listener, key);
        count--;
      }
    }
    this.dynDependencies.set(key, [...(this.dynDependencies.get(key) || []), parent]);
    parent.dynDependants.set(key, [...(parent.dynDependants.get(key) || []), this]);
  },

  notDupe() {
    return this.atom && !this.duplicate;
  },

  subscribe_: function (listener, visits, key) {
    if (visits.has(this)) return;
    visits.add(this);
    if (this.notDupe()) {
      key = NO_DUPE_KEY;
    }
    const countMap = this.listeners.get(key) || new Map();
    const currCount = countMap.get(listener) || 0;
    countMap.set(listener, currCount + 1);
    this.listeners.set(key, countMap);
    if (currCount === 0 && this.listenersChanged) {
      const newListeners = Array.from(countMap.keys());
      const oldListeners = newListeners.filter((f) => f !== listener);
      this.listenersChanged(newListeners, oldListeners, key);
    }
    this.getDependencies(key).forEach((d) => d.subscribe_(listener, visits, key));
  },

  subscribe: function (listener, key) {
    this.subscribe_(listener, new Set(), key);
  },

  unsubscribe_: function (listener, visits, key) {
    if (visits.has(this)) return;
    visits.add(this);
    if (this.notDupe()) {
      key = NO_DUPE_KEY;
    }

    const countMap = this.listeners.get(key) || new Map();
    const currCount = countMap.get(listener);
    if (!currCount) throw Error();
    if (currCount === 1) {
      countMap.delete(listener);
      if (this.listenersChanged) {
        const newListeners = Array.from(countMap.keys());
        const oldListeners = [...newListeners, listener];
        this.listenersChanged(newListeners, oldListeners, key);
      }
    } else {
      countMap.set(listener, currCount - 1);
    }
    this.getDependencies(key).forEach((d) => d.unsubscribe_(listener, visits, key));
  },

  unsubscribe: function (listener, key) {
    this.unsubscribe_(listener, new Set(), key);
  },

  getId: function () {
    return this.id;
  },

  getListeners: function (key) {
    if (this.notDupe()) {
      key = NO_DUPE_KEY;
    }
    const countMap = this.listeners.get(key) || new Map();
    return Array.from(countMap.keys());
  },

  getDependencies: function (key) {
    return [...this.dependencies, ...(this.dynDependencies.get(key) || [])];
  },

  getDependants: function (key) {
    if (key === NO_DUPE_KEY) {
      const set = new Set();
      for (const key of this.dynDependants.keys()) {
        for (const item of this.dynDependants.get(key) || []) {
          set.add(item);
        }
      }
      return Array.from(set).concat(this.dependants);
    }
    return [...this.dependants, ...(this.dynDependants.get(key) || [])];
  },
};
