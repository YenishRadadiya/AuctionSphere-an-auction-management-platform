import { Routes } from '@angular/router';
import { LoginComponent } from './features/user-auth/pages/login/login.component';
import { SignupComponent } from './features/user-auth/pages/signup/signup.component';
import { ForgotPasswordComponent } from './features/user-auth/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/user-auth/pages/reset-password/reset-password.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/Dashboard/components/dashboard/dashboard.component';
import { AddProductComponent } from './features/Dashboard/pages/add-product/add-product.component';
import { ManageProductComponent } from './features/Dashboard/pages/manage-product/manage-product.component';
import { AddAuctionComponent } from './features/Dashboard/pages/add-auction/add-auction.component';
import { AuctionListComponent } from './features/Dashboard/pages/auction-list/auction-list.component';

export const routes: Routes = [
    // {
    //     path: 'user', children: [
    //         { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    //         { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
    //         { path: 'forgot', component: ForgotPasswordComponent, canActivate: [guestGuard] },
    //         // No guard for reset-password so it's always accessible with a token
    //         { path: 'reset-password', component: ResetPasswordComponent },
    //         { path: '', redirectTo: 'login', pathMatch: 'full' }
    //     ],
    // },
    // { path: '', redirectTo: 'user/login', pathMatch: 'full' },
    // { path: '**', redirectTo: 'user/login' }




    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: SignupComponent, canActivate: [guestGuard] },
    { path: 'forgot', component: ForgotPasswordComponent, canActivate: [guestGuard] },
    { path: 'reset-password', component: ResetPasswordComponent },
    {
        path: '', component: DashboardComponent,
        children: [{
            path: 'product', children: [
                { path: 'add', component: AddProductComponent },
                { path: 'manage', component: ManageProductComponent }]
        },
        {
            path: 'auction', children: [
                { path: 'create', component: AddAuctionComponent },
                { path: 'all', component: AuctionListComponent }
            ]
        }]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }

];