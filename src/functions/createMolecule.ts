import { atom } from '../core/Atom';
import { DEFAULT_STORE, IStore } from '../core/Store';
import { mapValues } from '../helpers/map-values';
import { Atomify } from './types';

export function createMolecule<Slice>(params: {
  slice: Slice;
  key: string;
  duplicate?: boolean;
  store?: IStore;
}): Atomify<Slice>;

export function createMolecule(params: any) {
  const { key, slice } = params;
  return mapValues(slice, (val, k) => {
    const obj: any = {
      id: `${key}.${k}`,
      store: params.store || DEFAULT_STORE,
      metadata: { molecule: key },
      duplicate: params.duplicate,
      data: val,
    };
    return atom(obj);
  });
}
