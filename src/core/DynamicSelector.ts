import { dynamicSelectorMethods } from './DynamicSelector-methods';
import { parentMethods } from './ParentNode-methods';
import { AtomOrSelector, DynamicSelector, ListenerListener } from './types';

export const DYNAMIC_SELECTOR_PROTOTYPE = { ...parentMethods, ...dynamicSelectorMethods };

export function dynamicSelector<Return>(params: {
  id?: string;
  inputs?: AtomOrSelector<Return, any>;
  func: (get: <T>(node: AtomOrSelector<T, any>) => T) => Return;
  listenersChanged?: ListenerListener;
}): DynamicSelector<Return>;

export function dynamicSelector<Return>(
  func: (get: <T>(node: AtomOrSelector<T, any>) => T) => Return,
): DynamicSelector<Return>;

export function dynamicSelector(params) {
  if (typeof params === 'function') {
    params = { func: params };
  }
  const state = {
    data: params.data,
    metadata: null,
    cacheInputs: new Map(),
    cacheVal: new Map(),
    func: params.func,

    id: params.id || '-',
    dependencies: [],
    dependants: [],
    dynDependencies: new Map(),
    dynDependants: new Map(),
    listeners: new Map(),
    listenersChanged: params.listenersChanged || null,
    useCache: new Map(),

    __proto__: DYNAMIC_SELECTOR_PROTOTYPE,
  };

  for (let i = 0; i < state.dependencies.length; i++) {
    state.dependencies[i].addDependant(state);
  }
  return state as any;
}
