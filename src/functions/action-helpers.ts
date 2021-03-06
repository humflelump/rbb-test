import { isAction, isAtom, isEitherSelector } from './node-types';

export type AnyFunction = (...p: any[]) => any;

export type Action<T extends AnyFunction> = T & { construct: any };

const parentKeys = [
  'getId',
  'getListeners',
  'getDependencies',
  'getDependants',
  'subscribe',
  'unsubscribe',
  'listenersChanged',
];
const atomKeys = [...parentKeys, 'getMetadata', 'setIfShouldNotifyListeners', 'shouldNotifyListeners', 'get'];

const selectorKeys = [...parentKeys, 'get'];

function transformNode(obj, methods, key) {
  const node: any = {};
  for (const k of methods) {
    node[k] = (...params) => obj[k](...params, key);
  }
  node.__proto__ = obj.__proto__;
  return node;
}

export function transformDependencies(
  deps: object,
  key: any,
  loggingMap?: Map<any, any>,
  disallowNotifications?: boolean,
) {
  const result: any = {};
  for (const k in deps) {
    const node = deps[k];
    if (isAtom(node)) {
      const newNode = transformNode(node, atomKeys, key);
      newNode.set = (...params) => {
        loggingMap?.set(node, params[0]);
        if (disallowNotifications) {
          const prev = node.shouldNotifyListeners(key);
          node.setIfShouldNotifyListeners(false);
          node.set(...params, key);
          node.setIfShouldNotifyListeners(prev);
        } else {
          node.set(...params, key);
        }
      };
      newNode.update = (func, ...params) => {
        const newVal = func(node.get(...params, key));
        newNode.set(newVal, key);
      };

      result[k] = newNode;
    } else if (isEitherSelector(node)) {
      result[k] = transformNode(node, selectorKeys, key);
    } else if (isAction(node)) {
      result[k] = node.construct(key, loggingMap);
    } else {
      throw Error(`Unexpected Type: ${node}`);
    }
  }
  return result;
}
