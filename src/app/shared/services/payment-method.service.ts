import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const apiUrl = 'http://localhost:5046/api/';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  constructor(private http : HttpClient) { }

  getPaymentMethodByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}PaymentMethod/user/${userId}`).pipe(
      catchError(this.handleError<any[]>('getPaymentMethodByUserId', []))
    );
  }

  createPaymentMethod(paymentMethod: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}PaymentMethod`, paymentMethod).pipe(
      catchError(this.handleError<any>('createPaymentMethod'))
    );
  }

  deletePaymentMethod(id: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}PaymentMethod/${id}`).pipe(
      catchError(this.handleError<any>('deletePaymentMethod'))
    );
  }

  updatePaymentMethod(paymentMethod: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}PaymentMethod/${paymentMethod._id}`, paymentMethod).pipe(
      catchError(this.handleError<any>('updatePaymentMethod'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
