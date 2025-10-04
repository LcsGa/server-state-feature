import { signalState } from '@ngrx/signals';

export type ServerState<T> = {
  value: T;
  creating: boolean;
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  error: Error | undefined;
};

export function serverState<T>(value: T) {
  return signalState<ServerState<T>>({
    value,
    creating: false,
    loading: false,
    updating: false,
    deleting: false,
    error: undefined,
  });
}
