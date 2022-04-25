import { ATOM_PROTOTYPE } from '../core/Atom';
import { DYNAMIC_SELECTOR_PROTOTYPE } from '../core/DynamicSelector';
import { SELECTOR_PROTOTYPE } from '../core/Selector';

export function isAtom(obj: any) {
  return obj?.__proto__ === ATOM_PROTOTYPE;
}

export function isSelector(obj: any) {
  return obj?.__proto__ === SELECTOR_PROTOTYPE;
}

export function isDynamicSelector(obj: any) {
  return obj?.__proto__ === DYNAMIC_SELECTOR_PROTOTYPE;
}

export function isEitherSelector(obj: any) {
  return isDynamicSelector(obj) || isSelector(obj);
}

export function isAction(obj: any) {
  return typeof obj === 'function' && !!obj.construct;
}
