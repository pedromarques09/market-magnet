import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserModel } from '../models/userModel';

export interface IUser {
  email: string;
  avatarUrl?: string;
}

const defaultPath = '/';
const apiUrl = 'http://localhost:5046/api/';
@Injectable()
export class AuthService {
  private _user: any = null;
  get loggedIn(): boolean {
    return !!this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(private http: HttpClient, private router: Router) {}

  async logIn(email: string, password: string) {
    try {
      const response = await this.http
        .post<any>(apiUrl + 'Login', { email, password })
        .toPromise();
      localStorage.setItem('token', response.token);
      this._user = response.user;
      this.router.navigate(['/home']);
      return { isOk: true, data: this._user };
    } catch (error) {
      return { isOk: false, message: 'Email ou Senha invalido' };
    }
  }

  async getUser() {
    return { isOk: true, data: this._user };
  }

  async getUserById(id: string) {
    try {
      const user = await this.http
        .get<UserModel>(`${apiUrl}User/${id}`)
        .toPromise();
      return {
        isOk: true,
        data: user,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to get user',
      };
    }
  }

  async createAccount(name: string, email: string, password: string) {
    try {
      await this.http
        .post<UserModel>(apiUrl + 'User', { name, email, password })
        .toPromise();
      this.router.navigate(['/login-form']);
      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to create account',
      };
    }
  }
  async logOut() {
    this._user = null;
    this.router.navigate(['/login-form']);
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to change password',
      };
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to reset password',
      };
    }
  }

  async updateUser(user: UserModel) {
    try {
      await this.http
        .put<UserModel>(`${apiUrl}User/${this._user._id}`, user)
        .toPromise();
      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to update user',
      };
    }
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'login-form',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode',
    ].includes(route.routeConfig?.path || defaultPath);

    if (isLoggedIn && isAuthForm) {
      this.authService.lastAuthenticatedPath = defaultPath;
      this.router.navigate([defaultPath]);
      return false;
    }

    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/login-form']);
    }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath =
        route.routeConfig?.path || defaultPath;
    }

    return isLoggedIn || isAuthForm;
  }
}
