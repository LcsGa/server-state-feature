import { patchState, SignalState } from '@ngrx/signals';
import { MonoTypeOperatorFunction, Observable, Observer } from 'rxjs';
import { ServerState } from './server-state';
import {
  setComplete,
  setCreating,
  setDeleting,
  setError,
  setLoading,
  setUpdating,
} from './state-updater';

type Action = 'loading' | 'creating' | 'updating' | 'deleting';

const UPDATERS: Record<Action, Function> = {
  loading: setLoading,
  creating: setCreating,
  updating: setUpdating,
  deleting: setDeleting,
};

function tapServerState<T>(
  state: SignalState<ServerState<T>>,
  action: Action,
  observer?: Partial<Observer<NonNullable<T>>>,
): MonoTypeOperatorFunction<NonNullable<T>> {
  const { next, error, complete } = observer ?? {};
  return (source) =>
    new Observable((destination) => {
      patchState(state, UPDATERS[action]());
      return source.subscribe({
        next: (value) => {
          patchState(state, setComplete(value));
          next?.(value);
          destination.next(value);
        },
        error: (err) => {
          patchState(state, setError(err));
          error?.(err);
        },
        complete: () => {
          complete?.();
          destination.complete();
        },
      });
    });
}

export function tapServerStateLoading<T>(
  state: SignalState<ServerState<T>>,
  observer?: Partial<Observer<NonNullable<T>>>,
) {
  return tapServerState<T>(state, 'loading', observer);
}

export function tapServerStateCreating<T>(
  state: SignalState<ServerState<T>>,
  observer?: Partial<Observer<NonNullable<T>>>,
) {
  return tapServerState<T>(state, 'creating', observer);
}

export function tapServerStateUpdating<T>(
  state: SignalState<ServerState<T>>,
  observer?: Partial<Observer<NonNullable<T>>>,
) {
  return tapServerState<T>(state, 'updating', observer);
}

export function tapServerStateDeleting<T>(
  state: SignalState<ServerState<T>>,
  observer?: Partial<Observer<NonNullable<T>>>,
) {
  return tapServerState<T>(state, 'deleting', observer);
}
