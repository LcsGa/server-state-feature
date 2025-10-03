import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: 5;
};

export interface PartialProduct extends Partial<Product> {
  id: Product['id'];
}

@Injectable({ providedIn: 'root', useFactory: () => new HttpProductGateway() })
export abstract class ProductGateway {
  abstract getOneById(id: Product['id']): Observable<Product>;

  abstract updateOne(changes: PartialProduct): Observable<Product>;
}

class HttpProductGateway implements ProductGateway {
  private readonly httpClient = inject(HttpClient);
  private readonly BASE_URL = 'https://dummyjson.com/products';

  getOneById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.BASE_URL}/${id}`).pipe(delay(500));
  }

  updateOne({ id, ...changes }: PartialProduct): Observable<Product> {
    return this.httpClient.put<Product>(`${this.BASE_URL}/${id}`, changes);
  }
}
