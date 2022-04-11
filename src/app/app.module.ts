import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './users/admin/admin.component';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';
import { HeaderComponent } from './header/header.component';
import { CheckoutComponent } from './shop/checkout/checkout.component';
import { StoreProductComponent } from './shop/store-product/store-product.component';
import { ProfileComponent } from './users/profile/profile.component';
import { ProductPageComponent } from './shop/product-page/product-page.component';
import { ConfirmationCheckoutComponent } from './shop/confirmation-checkout/confirmation-checkout.component';
import { OrderHistoryComponent } from './shop/order-history/order-history.component';
import { ForgetPasswordComponent } from './users/forget-password/forget-password.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './shop/wishlist-page/wishlist/wishlist.component';
import { BundleComponent } from './users/bundle/bundle.component';



@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    HeaderComponent,
    AdminComponent,
    LoginComponent,
    RegisterComponent,
    StoreProductComponent,
    ProfileComponent,
    ProductPageComponent,
    ConfirmationCheckoutComponent,
    OrderHistoryComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    WishlistComponent,
    BundleComponent
  
    


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MaterialModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
