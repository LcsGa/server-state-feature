import { SignalState, signalState, signalStoreFeature, withProps } from '@ngrx/signals';

type ServerState<T> = {
  value: T;
  creating: boolean;
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  error: Error | undefined;
};

function serverState<T>(value: T) {
  return signalState<ServerState<T>>({
    value,
    creating: false,
    loading: false,
    updating: false,
    deleting: false,
    error: undefined,
  });
}

export function withServerState<State extends object>(state: State) {
  return signalStoreFeature(
    withProps(
      () =>
        Object.fromEntries(
          Object.entries(state).map(([key, value]) => [key, serverState(value)] as const)
        ) as unknown as { [K in keyof State]: SignalState<ServerState<State[K]>> }
    )
  );
}

export function setCreating<T>(): Partial<ServerState<T>> {
  return { creating: true, loading: false, updating: false, deleting: false, error: undefined };
}

export function setLoading<T>(): Partial<ServerState<T>> {
  return { creating: false, loading: true, updating: false, deleting: false, error: undefined };
}

export function setUpdating<T>(): Partial<ServerState<T>> {
  return { creating: false, loading: false, updating: true, deleting: false, error: undefined };
}

export function setDeleting<T>(): Partial<ServerState<T>> {
  return { creating: false, loading: false, updating: false, deleting: true, error: undefined };
}

export function setError<T>(error: unknown): Partial<ServerState<T>> {
  return {
    creating: false,
    loading: false,
    updating: false,
    deleting: false,
    error: error instanceof Error ? error : new Error('An error occured', { cause: error }),
  };
}

export function setComplete<T>(value: T): Partial<ServerState<T>> {
  return {
    value,
    creating: false,
    loading: false,
    updating: false,
    deleting: false,
    error: undefined,
  };
}
