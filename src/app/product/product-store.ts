import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, type, withHooks, withMethods, withState } from '@ngrx/signals';
import { Dispatcher, event } from '@ngrx/signals/events';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, noop, switchMap } from 'rxjs';
import { tapServerStateLoading, tapServerStateUpdating, withServerState } from '../server-state';
import { ProductGateway } from './product-gateway';
import { PartialProduct, Product } from './product-types';

export const productUpdated = event('[Product] updated', type<Product>());

export const ProductStore = signalStore(
  withState({ selected: 1, count: 0 }),
  withServerState<{ product: Product | null }>({ product: null }),
  withMethods((store, gateway = inject(ProductGateway), disaptcher = inject(Dispatcher)) => ({
    _getCount: rxMethod<void>(
      switchMap(() =>
        gateway
          .getCount()
          .pipe(tapResponse({ next: (count) => patchState(store, { count }), error: noop })),
      ),
    ),
    select: (id: Product['id']) =>
      patchState(store, ({ count }) => ({ selected: Math.max(Math.min(id, count), 1) })),
    next: () =>
      patchState(store, ({ selected, count }) => ({ selected: Math.min(selected + 1, count) })),
    previous: () => patchState(store, ({ selected }) => ({ selected: Math.max(selected - 1, 1) })),
    load: rxMethod<Product['id']>(
      switchMap((id) =>
        gateway
          .getOneById(id)
          .pipe(
            tapServerStateLoading(store.product, { error: () => alert('Failed to load product') }),
          ),
      ),
    ),
    update: rxMethod<PartialProduct>(
      exhaustMap((changes) =>
        gateway.updateOne(changes).pipe(
          tapServerStateUpdating(store.product, {
            next: (product) => disaptcher.dispatch(productUpdated(product)),
            error: () => alert('Failed to update product'),
          }),
        ),
      ),
    ),
  })),
  withHooks({
    onInit: ({ _getCount, load, selected }) => {
      _getCount();
      load(selected);
    },
  }),
);
