import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductStore } from './product-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  selector: 'app-product-paginator',
  styles: `
    :host {
      display: inline flex;
      gap: 16px;
    }
  `,
  template: `
    <button (click)="productStore.previous()" [disabled]="productStore.selected() === 1">
      <span class="material-symbols-outlined">arrow_back_ios_new</span>
    </button>

    <input
      type="number"
      [ngModel]="productStore.selected()"
      (ngModelChange)="productStore.select($event)"
    />

    <button
      (click)="productStore.next()"
      [disabled]="productStore.selected() === productStore.count()"
    >
      <span class="material-symbols-outlined">arrow_forward_ios</span>
    </button>
  `,
})
export class ProductPaginator {
  protected readonly productStore = inject(ProductStore);
}
