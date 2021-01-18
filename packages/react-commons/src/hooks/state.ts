import { DeepPartial } from '@m-fe/utils';
import { merge } from 'lodash';
import { useCallback, useState } from 'react';

export const useLiteState = <T extends Record<string, unknown>>(
  initialState?: T | (() => T)
): [T, (newState: DeepPartial<T>) => void] => {
  const [state, setState] = useState(initialState);
  const setLiteState = useCallback(
    (newState: DeepPartial<T> | null) => {
      if (newState == null) {
        setState(newState as null);
        return;
      }
      setState(merge({}, state, newState));
    },
    [state]
  );
  return [state, setLiteState];
};
