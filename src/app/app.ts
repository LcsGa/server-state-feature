import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductStore } from './product-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductStore],
  selector: 'app-root',
  template: `
    @if (product.loading()) {
      Loading...
    } @else if (product.value(); as product) {
      {{ product.title }} - {{ product.price }}$
    }
  `,
})
export class App {
  protected readonly product = inject(ProductStore).product;
}
