import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import {
  setComplete,
  setError,
  setLoading,
  setUpdating,
  withServerState,
} from './server-state-feature';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PartialProduct, Product, ProductGateway } from './product-gateway';
import { inject } from '@angular/core';
import { exhaustMap, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export const ProductStore = signalStore(
  withServerState<{ product: Product | null }>({ product: null }),
  withMethods((store, gateway = inject(ProductGateway)) => ({
    load: rxMethod<Product['id']>(
      switchMap((id) => {
        patchState(store.product, setLoading());
        return gateway.getOneById(id).pipe(
          tapResponse({
            next: (product) => patchState(store.product, setComplete(product)),
            error: (error) => patchState(store.product, setError(error)),
          })
        );
      })
    ),
    update: rxMethod<PartialProduct>(
      exhaustMap((changes) => {
        patchState(store.product, setUpdating());
        return gateway.updateOne(changes).pipe(
          tapResponse({
            next: (product) => patchState(store.product, setComplete(product)),
            error: (error) => patchState(store.product, setError(error)),
          })
        );
      })
    ),
  })),
  withHooks({ onInit: ({ load }) => load(1) })
);
