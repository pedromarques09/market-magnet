import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const apiUrl = 'http://localhost:5046/api/';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) { }

  getProductByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}Product/user/${userId}`).pipe(
      catchError(this.handleError<any[]>('getProductByUserId', []))
    );
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}Product`, product).pipe(
      catchError(this.handleError<any>('createProduct'))
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}Product/${id}`).pipe(
      catchError(this.handleError<any>('deleteProduct'))
    );
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}Product/${product._id}`, product).pipe(
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
