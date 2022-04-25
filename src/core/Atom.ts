import { atomMethods } from './Atom-methods';
import { parentMethods } from './ParentNode-methods';
import { DEFAULT_STORE, IStore } from './Store';
import { Atom, AtomMiddleware, ListenerListener } from './types';

export const ATOM_PROTOTYPE = { ...parentMethods, ...atomMethods };

export function atom<Return, Metadata = null>(params: {
  data: Return | ((key: any) => Return);
  duplicate?: boolean;
  id?: string;
  metadata?: Metadata;
  listenersChanged?: ListenerListener;
  middleware?: AtomMiddleware<Return>[];
  store?: IStore;
}): Atom<Return, Metadata>;

export function atom<Return, Metadata = null>(data: Return): Atom<Return, Metadata>;

export function atom(params) {
  if (!params || typeof params !== 'object' || !('data' in params)) {
    params = { data: params, id: '-' };
  }
  const store: IStore = params.store || DEFAULT_STORE;
  const state: any = {
    data: new Map(),
    init: typeof params.data === 'function' ? params.data : () => params.data,
    duplicate: params.duplicate,
    metadata: 'metadata' in params ? params.metadata : null,
    middleware: params.middleware || [],
    id: params.id || '-',
    dependencies: [],
    dependants: [],
    dynDependencies: new Map(),
    dynDependants: new Map(),
    listeners: new Map(),
    listenersChanged: params.listenersChanged || null,
    store,
    useCache: new Map(), // false
    notifyListeners: new Map(), // true
    atom: true,
    __proto__: ATOM_PROTOTYPE,
  };
  store.atomCreated(state);
  return state;
}
