import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  constructor(private authService: AuthService) {
    this.getUsername();
  }
  private username!: string;
  private userNameSource = new BehaviorSubject<string>(this.username);
  currentUserName$ = this.userNameSource.asObservable();

  async getUsername() {
    const user = await this.authService.getUser();
    this.username = user.data.name;
    this.userNameSource.next(this.username);
  }

  updateUserName(name: string) {
    this.userNameSource.next(name);
  }
}
