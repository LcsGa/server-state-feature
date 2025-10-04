import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { PartialProduct, Product } from './product-types';

@Injectable({ providedIn: 'root', useFactory: () => new HttpProductGateway() })
export abstract class ProductGateway {
  abstract getCount(): Observable<number>;

  abstract getOneById(id: Product['id']): Observable<Product>;

  abstract updateOne(changes: PartialProduct): Observable<Product>;
}

class HttpProductGateway implements ProductGateway {
  private readonly httpClient = inject(HttpClient);
  private readonly BASE_URL = 'https://dummyjson.com/products';

  getCount(): Observable<number> {
    const params = new HttpParams({ fromObject: { limit: 0 } });
    return this.httpClient
      .get<{ total: number }>(this.BASE_URL, { params })
      .pipe(map(({ total }) => total));
  }

  getOneById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.BASE_URL}/${id}`).pipe(delay(500));
  }

  updateOne({ id, ...changes }: PartialProduct): Observable<Product> {
    return this.httpClient.put<Product>(`${this.BASE_URL}/${id}`, changes).pipe(delay(500));
  }
}
