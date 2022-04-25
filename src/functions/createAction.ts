import { ACTION_COMPLETED } from './event-types';
import { DEFAULT_STORE, IStore } from '../core/Store';
import { Atom, AtomOrSelector } from '../core/types';
import { Action, AnyFunction, transformDependencies } from './action-helpers';
import { setMultiple } from './setMultiple';

export function createAction<
  Use extends { [key: string]: AtomOrSelector<any> | Action<AnyFunction> },
  Func extends (...p: any[]) => any,
>(params: {
  use: Use;
  func: (nodes: Use) => Func;
  id?: string;
  key?: any;
  store?: IStore;
  loggingMap?: Map<Atom<any>, any>;
}): Action<Func>;

export function createAction(props) {
  const { key, use } = props;
  const id = props.id || '-';
  const store: IStore = props.store || DEFAULT_STORE;

  const action = (...params) => {
    const loggingMap = props.loggingMap || new Map();
    props = {
      ...props,
      use: transformDependencies(use, key, loggingMap, true),
    };

    const result = props.func(props.use)(...params);
    if (!props.loggingMap) {
      const atomList: any = Array.from(loggingMap.keys());
      const atomVals = atomList.map((a) => loggingMap.get(a));
      setMultiple(atomList as any, atomVals as any, key);
      store.sendMessage({
        type: 'ACTION_COMPLETED',
        arguments: params,
        returnVal: result,
        id,
        updates: atomList.map((atom, i) => ({ atom, value: atomVals[i] })),
      } as ACTION_COMPLETED);
    }

    return result;
  };

  action.construct = (key, loggingMap) => {
    return createAction({ ...props, key, loggingMap });
  };

  return action;
}

export function injectKey<Func extends AnyFunction>(action: Action<Func>, key: any): Action<Func> {
  return action.construct(key) as any as Action<Func>;
}
