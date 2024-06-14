import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ConditionModel } from '../models/conditionModel';

const apiUrl = 'http://localhost:5046/api/';

@Injectable({
  providedIn: 'root',
})
export class PaymentConditionService {
  constructor(private http: HttpClient) {}

  getPaymentConditionByUserId(userId: string): Observable<ConditionModel[]> {
    return this.http
      .get<ConditionModel[]>(`${apiUrl}PaymentCondition/user/${userId}`)
      .pipe(
        catchError(
          this.handleError<ConditionModel[]>('getPaymentConditionByUserId', [])
        )
      );
  }

  createPaymentCondition(
    paymentCondition: ConditionModel
  ): Observable<ConditionModel> {
    return this.http
      .post<ConditionModel>(`${apiUrl}PaymentCondition`, paymentCondition)
      .pipe(
        catchError(this.handleError<ConditionModel>('createPaymentCondition'))
      );
  }

  deletePaymentCondition(id: string): Observable<ConditionModel> {
    return this.http
      .delete<ConditionModel>(`${apiUrl}PaymentCondition/${id}`)
      .pipe(
        catchError(this.handleError<ConditionModel>('deletePaymentCondition'))
      );
  }

  updatePaymentCondition(
    paymentCondition: ConditionModel
  ): Observable<ConditionModel> {
    return this.http
      .put<ConditionModel>(
        `${apiUrl}PaymentCondition/${paymentCondition._id}`,
        paymentCondition
      )
      .pipe(
        catchError(this.handleError<ConditionModel>('updatePaymentCondition'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
