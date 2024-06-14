import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SaleModel } from '../models/saleModel';

const apiUrl = 'http://localhost:5046/api/';
@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private http: HttpClient) {}
  getSaleByUserId(userId: string): Observable<SaleModel[]> {
    return this.http
      .get<SaleModel[]>(`${apiUrl}Sale/user/${userId}`)
      .pipe(catchError(this.handleError<SaleModel[]>('getSaleByUserId', [])));
  }

  getLastSale(userId: string): Observable<SaleModel> {
    return this.http
      .get<SaleModel>(`${apiUrl}Sale/user/last/${userId}`)
      .pipe(catchError(this.handleError<SaleModel>('getSaleByUserId')));
  }

  getSaleById(id: string): Observable<SaleModel> {
    return this.http
      .get<SaleModel>(`${apiUrl}Sale/${id}`)
      .pipe(catchError(this.handleError<SaleModel>('getSaleById')));
  }

  createSale(sale: SaleModel): Observable<SaleModel> {
    return this.http
      .post<SaleModel>(`${apiUrl}Sale`, sale)
      .pipe(catchError(this.handleError<SaleModel>('createSale')));
  }

  deleteSale(id: string): Observable<SaleModel> {
    return this.http
      .delete<SaleModel>(`${apiUrl}Sale/${id}`)
      .pipe(catchError(this.handleError<SaleModel>('deleteSale')));
  }

  updateSale(sale: SaleModel): Observable<SaleModel> {
    return this.http
      .put<SaleModel>(`${apiUrl}Sale/${sale._id}`, sale)
      .pipe(catchError(this.handleError<SaleModel>('updateSale')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
