import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from './product-types';
import { UpdateProduct } from './update-product';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpdateProduct, NgOptimizedImage, CurrencyPipe],
  selector: 'app-product-card',
  styles: `
    figure {
      position: relative;
      border: 2px solid hsl(0 0 85);
      border-radius: 8px;
      padding: 12px 16px;
      max-inline-size: 240px;

      app-update-product {
        position: absolute;
        inset-inline-end: 8px;
        inset-block-start: 8px;
      }

      img {
        display: block;
        margin-inline: auto;
      }

      figcaption > * {
        margin-block-start: 12px;
      }
    }
  `,
  template: `
    <figure>
      <app-update-product />

      <img [ngSrc]="product().thumbnail" [alt]="product().title" width="100" height="100" />

      <figcaption>
        <h2>{{ product().title }}</h2>

        <p>{{ product().description }}</p>

        <p>
          <strong>{{ product().price | currency }}</strong>
        </p>
      </figcaption>
    </figure>
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
}
