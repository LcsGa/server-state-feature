import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Events } from '@ngrx/signals/events';
import { ProductStore, productUpdated } from './product-store';
import { Product } from './product-types';

type ProductForm = {
  [K in keyof Pick<Product, 'title' | 'description' | 'price'>]: FormControl<
    Product[K] | undefined
  >;
};

@Component({
  selector: 'app-update-product',
  imports: [ReactiveFormsModule],
  styles: `
    form {
      display: grid;
      row-gap: 12px;

      input,
      textarea {
        inline-size: 100%;
      }

      textarea {
        field-sizing: content;
        max-block-size: 10lh;
      }

      h2,
      menu {
        grid-column: 1 / -1;
      }

      menu {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        margin-block-start: 8px;

        button {
          inline-size: 100%;
        }
      }
    }
  `,
  template: `
    <button class="small" (click)="openDialog()">
      <span class="material-symbols-outlined">edit</span>
    </button>

    <dialog #dialog (keydown.escape)="$event.preventDefault()">
      <form [formGroup]="productForm()" (ngSubmit)="submit()">
        <h2>Edit Product</h2>

        <label>
          <p>Title</p>
          <input type="text" autofocus formControlName="title" />
        </label>

        <label>
          <p>Description</p>
          <textarea formControlName="description"></textarea>
        </label>

        <label>
          <p>Price</p>
          <input type="number" formControlName="price" />
        </label>

        <menu>
          @let updating = productStore.product.updating();
          <li>
            <button
              class="danger"
              formmethod="dialog"
              type="button"
              [disabled]="updating"
              (click)="closeDialog()"
            >
              Cancel
            </button>
          </li>

          <li>
            <button class="primary" [disabled]="updating">
              @if (updating) {
                Registering...
              } @else {
                Register
              }
            </button>
          </li>
        </menu>
      </form>
    </dialog>
  `,
})
export class UpdateProduct {
  protected readonly productStore = inject(ProductStore);

  readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly productForm = computed(() => {
    const { title, description, price } = this.productStore.product.value() ?? {};
    return new FormGroup<ProductForm>({
      title: new FormControl(title, { nonNullable: true }),
      description: new FormControl(description, { nonNullable: true }),
      price: new FormControl(price, { nonNullable: true }),
    });
  });

  constructor() {
    inject(Events)
      .on(productUpdated)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.closeDialog());
  }

  protected openDialog() {
    this.dialogRef().nativeElement.showModal();
  }

  protected closeDialog() {
    this.dialogRef().nativeElement.close();
    const product = this.productStore.product.value();
    if (product) this.productForm().reset(product);
  }

  protected submit() {
    const id = this.productStore.product.value()?.id;
    if (!id) return;
    this.productStore.update({ id, ...this.productForm().value });
  }
}
