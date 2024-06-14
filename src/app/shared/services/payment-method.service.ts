import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MethodModel } from '../models/methodModel';

const apiUrl = 'http://localhost:5046/api/';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  constructor(private http: HttpClient) {}

  getPaymentMethodByUserId(userId: string): Observable<MethodModel[]> {
    return this.http
      .get<MethodModel[]>(`${apiUrl}PaymentMethod/user/${userId}`)
      .pipe(
        catchError(
          this.handleError<MethodModel[]>('getPaymentMethodByUserId', [])
        )
      );
  }

  createPaymentMethod(paymentMethod: MethodModel): Observable<MethodModel> {
    return this.http
      .post<MethodModel>(`${apiUrl}PaymentMethod`, paymentMethod)
      .pipe(catchError(this.handleError<MethodModel>('createPaymentMethod')));
  }

  deletePaymentMethod(id: string): Observable<MethodModel> {
    return this.http
      .delete<MethodModel>(`${apiUrl}PaymentMethod/${id}`)
      .pipe(catchError(this.handleError<MethodModel>('deletePaymentMethod')));
  }

  updatePaymentMethod(paymentMethod: MethodModel): Observable<MethodModel> {
    return this.http
      .put<MethodModel>(
        `${apiUrl}PaymentMethod/${paymentMethod._id}`,
        paymentMethod
      )
      .pipe(catchError(this.handleError<MethodModel>('updatePaymentMethod')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
