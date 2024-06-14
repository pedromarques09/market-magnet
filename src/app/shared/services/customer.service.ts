import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomerModel } from '../models/customerModel';

const apiUrl = 'http://localhost:5046/api/';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getCustomerByUserId(userId: string): Observable<CustomerModel[]> {
    return this.http
      .get<CustomerModel[]>(`${apiUrl}Customer/user/${userId}`)
      .pipe(
        catchError(this.handleError<CustomerModel[]>('getCustomerByUserId', []))
      );
  }

  getLastCustomer(userId: string): Observable<CustomerModel> {
    return this.http
      .get<CustomerModel>(`${apiUrl}Customer/user/last/${userId}`)
      .pipe(catchError(this.handleError<CustomerModel>('getLastCustomer')));
  }

  createCustomer(customer: CustomerModel): Observable<CustomerModel> {
    return this.http
      .post<CustomerModel>(`${apiUrl}Customer`, customer)
      .pipe(catchError(this.handleError<CustomerModel>('createCustomer')));
  }

  deleteCustomer(id: string): Observable<CustomerModel> {
    return this.http
      .delete<CustomerModel>(`${apiUrl}Customer/${id}`)
      .pipe(catchError(this.handleError<CustomerModel>('deleteCustomer')));
  }

  updateCustomer(customer: CustomerModel): Observable<CustomerModel> {
    return this.http
      .put<CustomerModel>(`${apiUrl}Customer/${customer._id}`, customer)
      .pipe(catchError(this.handleError<CustomerModel>('updateCustomer')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
