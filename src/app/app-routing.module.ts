import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  LoginFormComponent,
  ResetPasswordFormComponent,
  CreateAccountFormComponent,
  ChangePasswordFormComponent,
} from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import {
  DxDataGridModule,
  DxFormModule,
  DxSpeedDialActionModule,
  DxSelectBoxModule,
  DxNumberBoxModule,
} from 'devextreme-angular';
import { ProductsComponent } from './pages/products/products.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';
import { PaymentConditionComponent } from './pages/payment-condition/payment-condition.component';
import { SalesComponent } from './pages/sales/sales.component';
import { SaleFormComponent } from './shared/components/sale-form/sale-form.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'payment-method',
    component: PaymentMethodComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'payment-condition',
    component: PaymentConditionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'sales',
    component: SalesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'sale-form',
    component: SaleFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxFormModule,
    DxSpeedDialActionModule,
    CommonModule,
  ],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    ProfileComponent,
    ProductsComponent,
    CustomersComponent,
    PaymentMethodComponent,
    PaymentConditionComponent,
    SalesComponent,
  ],
})
export class AppRoutingModule {}
