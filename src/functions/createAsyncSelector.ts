import { AtomOrSelector, Selector } from '../core/types';
import { AsyncSelectorPromiseState } from './types';
import { atom } from '../core/Atom';
import { selector } from '../core/Selector';
import { createId } from '../helpers/createId';

export function createAsyncSelector<ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs?: [];
  func: (state: AsyncSelectorPromiseState) => Promise<ReturnType>;
  shouldUseAsync?: () => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [AtomOrSelector<S1>];
  func: (val1: S1, state: AsyncSelectorPromiseState) => Promise<ReturnType>;
  shouldUseAsync?: (val1: S1) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, S2, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [AtomOrSelector<S1>, AtomOrSelector<S2>];
  func: (val1: S1, val2: S2, state: AsyncSelectorPromiseState) => Promise<ReturnType>;
  shouldUseAsync?: (val1: S1, val2: S2) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, S2, S3, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [AtomOrSelector<S1>, AtomOrSelector<S2>, AtomOrSelector<S3>];
  func: (val1: S1, val2: S2, val3: S3, state: AsyncSelectorPromiseState) => Promise<ReturnType>;
  shouldUseAsync?: (val1: S1, val2: S2, val3: S3) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, S2, S3, S4, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [AtomOrSelector<S1>, AtomOrSelector<S2>, AtomOrSelector<S3>, AtomOrSelector<S4>];
  func: (val1: S1, val2: S2, val3: S3, val4: S4, state: AsyncSelectorPromiseState) => Promise<ReturnType>;
  shouldUseAsync?: (val1: S1, val2: S2, val3: S3, val4: S4) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, S2, S3, S4, S5, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [AtomOrSelector<S1>, AtomOrSelector<S2>, AtomOrSelector<S3>, AtomOrSelector<S4>, AtomOrSelector<S5>];
  func: (val1: S1, val2: S2, val3: S3, val4: S4, val5: S5, state: AsyncSelectorPromiseState) => Promise<ReturnType>;
  shouldUseAsync?: (val1: S1, val2: S2, val3: S3, val4: S4, val5: S5) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, S2, S3, S4, S5, S6, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>,
    AtomOrSelector<S6>,
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    state: AsyncSelectorPromiseState,
  ) => Promise<ReturnType>;
  shouldUseAsync?: (val1: S1, val2: S2, val3: S3, val4: S4, val5: S5, val6: S6) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, S2, S3, S4, S5, S6, S7, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>,
    AtomOrSelector<S6>,
    AtomOrSelector<S7>,
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    state: AsyncSelectorPromiseState,
  ) => Promise<ReturnType>;
  shouldUseAsync?: (val1: S1, val2: S2, val3: S3, val4: S4, val5: S5, val6: S6, val7: S7) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, S2, S3, S4, S5, S6, S7, S8, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>,
    AtomOrSelector<S6>,
    AtomOrSelector<S7>,
    AtomOrSelector<S8>,
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    val8: S8,
    state: AsyncSelectorPromiseState,
  ) => Promise<ReturnType>;
  shouldUseAsync?: (val1: S1, val2: S2, val3: S3, val4: S4, val5: S5, val6: S6, val7: S7, val8: S8) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector<S1, S2, S3, S4, S5, S6, S7, S8, S9, ReturnType, DefaultValue = null>(params: {
  id: string;
  inputs: [
    AtomOrSelector<S1>,
    AtomOrSelector<S2>,
    AtomOrSelector<S3>,
    AtomOrSelector<S4>,
    AtomOrSelector<S5>,
    AtomOrSelector<S6>,
    AtomOrSelector<S7>,
    AtomOrSelector<S8>,
    AtomOrSelector<S9>,
  ];
  func: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    val8: S8,
    val9: S9,
    state: AsyncSelectorPromiseState,
  ) => Promise<ReturnType>;
  shouldUseAsync?: (
    val1: S1,
    val2: S2,
    val3: S3,
    val4: S4,
    val5: S5,
    val6: S6,
    val7: S7,
    val8: S8,
    val9: S9,
  ) => boolean;
  defaultValue: DefaultValue;
  throttle?: (f: () => void) => () => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, () => void];

export function createAsyncSelector(params) {
  const { func, inputs } = params;
  const throttle = params.throttle || ((f) => f);
  const shouldUseAsync = params.shouldUseAsync || (() => true);
  const id = params.id || '-';
  const uid = createId();
  const defaultValue = 'defaultValue' in params ? params.defaultValue : null;

  const [isLoadingAtom, errorAtom, valueAtom, callState] = [
    { id: `l_${id}`, data: false },
    { id: `e_${id}`, data: void 0 },
    { id: `v_${id}`, data: defaultValue },
    { id: `c_${id}`, data: null },
  ].map((d) =>
    atom({
      ...d,
      duplicate: true,
      metadata: { asyncSelector: uid, id },
    }),
  );

  const isLoadingSelector = selector({
    id: `ls_${id}`,
    inputs: [isLoadingAtom],
    func: (d) => d,
  });

  const errorSelector = selector({
    id: `es_${id}`,
    inputs: [errorAtom],
    func: (d) => d,
  });

  const newFunc = throttle((vals, key, callId) => {
    const state = callState.get(key);
    if (state.callId !== callId) return;
    func(...vals, state)
      .then((res) => {
        if (state.cancelled) return;
        callState.set(null, key);
        valueAtom.set(res, key);
        isLoadingAtom.set(false, key);
      })
      .catch((err) => {
        if (state.cancelled) return;
        callState.set(null, key);
        errorAtom.set(err, key);
        isLoadingAtom.set(false, key);
      });
  });

  const asyncSelector = selector({
    id: 'wow',
    inputs,
    func: (...d) => {
      const vals = d.slice(0, d.length - 1);
      const key = d[d.length - 1];
      if (!shouldUseAsync(...vals)) return;
      const prevState = callState.get(key);
      if (prevState) {
        prevState.cancelled = true;
        prevState.onCancel();
        errorAtom.set(void 0, key);
      }
      const callId = createId();
      callState.set({callId, cancelled: false, onCancel: _ => _}, key);
      isLoadingAtom.set(true, key);
      newFunc(vals, key, callId);
    },
  });

  const resultSelector = selector({
    id: 'yo',
    inputs: [asyncSelector, valueAtom],
    func: (a, b) => b,
  });

  return [resultSelector, isLoadingSelector, errorSelector, () => null];
}
