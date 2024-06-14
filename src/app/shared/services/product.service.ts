import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductModel } from '../models/productModel';
import { PayloadModel } from '../models/saleModel';

const apiUrl = 'http://localhost:5046/api/';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductByUserId(userId: string): Observable<ProductModel[]> {
    return this.http
      .get<ProductModel[]>(`${apiUrl}Product/user/${userId}`)
      .pipe(
        catchError(this.handleError<ProductModel[]>('getProductByUserId', []))
      );
  }

  getLastProduct(userId: string): Observable<ProductModel> {
    return this.http
      .get<ProductModel>(`${apiUrl}Product/user/last/${userId}`)
      .pipe(catchError(this.handleError<ProductModel>('getLastProduct')));
  }

  createProduct(product: ProductModel): Observable<ProductModel> {
    return this.http
      .post<ProductModel>(`${apiUrl}Product`, product)
      .pipe(catchError(this.handleError<ProductModel>('createProduct')));
  }

  updateStock(payload: PayloadModel): Observable<ProductModel[]> {
    return this.http
      .put<ProductModel[]>(`${apiUrl}Product/quantity`, payload)
      .pipe(
        catchError(
          this.handleError<ProductModel[]>('updateProductQuantity', [])
        )
      );
  }

  deleteProduct(id: string): Observable<ProductModel> {
    return this.http
      .delete<ProductModel>(`${apiUrl}Product/${id}`)
      .pipe(catchError(this.handleError<ProductModel>('deleteProduct')));
  }

  updateProduct(product: ProductModel): Observable<ProductModel> {
    return this.http
      .put<ProductModel>(`${apiUrl}Product/${product._id}`, product)
      .pipe(catchError(this.handleError<ProductModel>('updateProduct')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
