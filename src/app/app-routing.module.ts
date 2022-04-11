import { ForgetPasswordComponent } from './users/forget-password/forget-password.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from './shop/product-page/product-page.component';
import { StoreProductComponent } from './shop/store-product/store-product.component';
import { AdminGuard } from './users/admin/admin.guard';
import { AdminComponent } from './users/admin/admin.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { ProfileComponent } from './users/profile/profile.component';
import { CheckoutComponent } from './shop/checkout/checkout.component';
import { ConfirmationCheckoutComponent } from "./shop/confirmation-checkout/confirmation-checkout.component";
import { OrderHistoryComponent } from "./shop/order-history/order-history.component";
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { WishlistComponent } from './shop/wishlist-page/wishlist/wishlist.component';
import { BundleComponent } from './users/bundle/bundle.component';






const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
  { path: "checkout", component: CheckoutComponent, canActivate: [AdminGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AdminGuard] },
  { path: 'product', component: StoreProductComponent },
  { path: '', redirectTo: 'product', pathMatch: 'full' },
  { path: "product-page", component: ProductPageComponent },
  { path: "product-page/:productId", component: ProductPageComponent },
  { path: "confirmation-checkout/:sentTransaction", component: ConfirmationCheckoutComponent, canActivate: [AdminGuard] },
  { path: "order-history", component: OrderHistoryComponent, canActivate: [AdminGuard] },
  { path: "forget-password", component: ForgetPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "wishlist", component: WishlistComponent, canActivate: [AdminGuard] },
  { path: "bundle", component: BundleComponent },

];


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}

