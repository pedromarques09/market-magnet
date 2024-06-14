import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  SideNavOuterToolbarModule,
  SideNavInnerToolbarModule,
  SingleCardModule,
} from './layouts';
import {
  FooterModule,
  ResetPasswordFormModule,
  CreateAccountFormModule,
  ChangePasswordFormModule,
  LoginFormModule,
} from './shared/components';
import {
  AuthService,
  ScreenService,
  AppInfoService,
  ProductService,
  PaymentConditionService,
  PaymentMethodService,
  CustomerService,
} from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SaleFormModule } from './shared/components/sale-form/sale-form.component';
import { AuthInterceptor } from './auth.interceptor';
import { SaleService } from './shared/services/sale.service';
import { UserStateService } from './shared/services/user-state.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    SaleFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    ScreenService,
    AppInfoService,
    ProductService,
    CustomerService,
    SaleService,
    PaymentConditionService,
    PaymentMethodService,
    UserStateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
