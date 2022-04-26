import { Atom } from '../core/types';

export type ActionFunction = {
  (): void;
  getId(): string;
};

export type Setter<Input> = (val: Input) => void;

export type AsyncSelectorPromiseState = {
  callId: string;
  cancelled: boolean;
  onCancel: () => void;
};

export type AsyncActionState = {
  id: string;
  cancelled: boolean;
  onCancel: () => void;
};

export type AsyncActionFunction = {
  (): AsyncActionState;
  getId(): string;
};

type AnyFunction = (...p: any[]) => any;

export type Atomify<Object> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof Object]: Object[P] extends AnyFunction ? Atom<ReturnType<Object[P]>> : Atom<Object[P]>;
};

export type ActionChange = {
  from: any;
  to: any;
  atom: Atom<any, any>;
};

export type ActionEffect = {
  id: string;
  changes: ActionChange[];
};
