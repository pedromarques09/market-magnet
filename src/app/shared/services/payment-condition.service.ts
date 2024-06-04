import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';


const apiUrl = 'http://localhost:5046/api/';

@Injectable({
  providedIn: 'root'
})
export class PaymentConditionService {

  constructor(private http : HttpClient) { }

  getPaymentConditionByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}PaymentCondition/user/${userId}`).pipe(
      catchError(this.handleError<any[]>('getPaymentConditionByUserId', []))
    );
  }

  createPaymentCondition(paymentCondition: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}PaymentCondition`, paymentCondition).pipe(
      catchError(this.handleError<any>('createPaymentCondition'))
    );
  }

  deletePaymentCondition(id: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}PaymentCondition/${id}`).pipe(
      catchError(this.handleError<any>('deletePaymentCondition'))
    );
  }

  updatePaymentCondition(paymentCondition: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}PaymentCondition/${paymentCondition._id}`, paymentCondition).pipe(
      catchError(this.handleError<any>('updatePaymentCondition'))
    );
}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}

