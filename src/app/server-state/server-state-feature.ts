import { SignalState, signalStoreFeature, withProps } from '@ngrx/signals';
import { ServerState, serverState } from './server-state';

export function withServerState<State extends object>(state: State) {
  return signalStoreFeature(
    withProps(
      () =>
        Object.fromEntries(
          Object.entries(state).map(([key, value]) => [key, serverState(value)]),
        ) as unknown as { [K in keyof State]: SignalState<ServerState<State[K]>> },
    ),
  );
}
