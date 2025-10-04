import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCard, ProductPaginator, ProductStore } from './product';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, ProductPaginator],
  providers: [ProductStore],
  selector: 'app-root',
  styles: `
    :host {
      display: grid;
      row-gap: 16px;
      place-content: center;
      justify-items: center;

      .error {
        color: var(--color-error);
      }
    }
  `,
  template: `
    <app-product-paginator />
    @if (product.loading()) {
      <p>Loading...</p>
    } @else if (product.error()) {
      <p class="error">{{ product.error()?.message }}</p>
    } @else if (product.value(); as product) {
      <app-product-card [product]="product" />
    }
  `,
})
export class App {
  protected readonly product = inject(ProductStore).product;
}
