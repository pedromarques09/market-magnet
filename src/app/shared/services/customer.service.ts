import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const apiUrl = 'http://localhost:5046/api/';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomerByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}Customer/user/${userId}`).pipe(
      catchError(this.handleError<any[]>('getCustomerByUserId', []))
    );
  }

  createCustomer(customer: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}Customer`, customer).pipe(
      catchError(this.handleError<any>('createCustomer'))
    );
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}Customer/${id}`).pipe(
      catchError(this.handleError<any>('deleteCustomer'))
    );
  }

  updateCustomer(customer: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}Customer/${customer._id}`, customer).pipe(
      catchError(this.handleError<any>('updateCustomer'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

