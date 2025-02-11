import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Product, ProductAndDiscount } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Cart, CartAndItems, CartItem } from "../../models/cart.model";
import { TokenStorageService } from "../../services/token-storage.service";
import { CartItemService } from "../../services/cart-item.service";
import { CartAndItemsService } from "../../services/cart-and-items.service";
import { WishlistAndItemsService } from 'src/app/services/wishlist-and-items.service';
import { Wishlist, WishlistAndItems, WishlistItem } from 'src/app/models/wishlist.model';
import { WishlistItemService } from 'src/app/services/wishlist-item.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-store-product',
  templateUrl: './store-product.component.html',
  styleUrls: ['./store-product.component.scss']
})
export class StoreProductComponent implements OnInit {
  
  darkModeToggle = new FormControl(false);
  @HostBinding('class') className = '';

  allProducts: Product[] = [];
  allDiscountProducts: ProductAndDiscount[] = [];
  indexArray: number[] = [];
  productObject: Product = new Product();
  formValue      !: FormGroup;
  errorProductMsg: string = '';
  saveIndex: number = 0;
  userId: any = 0;
  cartAndItems: CartAndItems = new CartAndItems()
  wishlistAndItems: WishlistAndItems = new WishlistAndItems()

  //Array for Form Fields to add new Product
  newProduct: Product = {
    productId: 0,
    productSku: "",
    productName: "",
    productDescription: "",
    productCategory: "",
    productCost: 0.0,
    productQty: 0,
    productRemoved: false,
    imageUrl: ""
  }

  NewDiscountedProduct: ProductAndDiscount = {

    productId: 0,
    productSku: "",
    productName: "",
    productDescription: "",
    productCategory: "",
    productCost: 0.0,
    productQty: 0,
    imageUrl: "",
    productRemoved: false,
    discountId: 0,
    discountDescription: "",
    discountPercentage: 0
  }

  searchQuery: string="";


  constructor(
    private router: Router,
    private wishlistItemService: WishlistItemService,
    private formbuilder: FormBuilder,
    private productService: ProductService,
    private tokenService: TokenStorageService,
    private wishlistAndItemsService: WishlistAndItemsService,
    private cartAndItemsService: CartAndItemsService,
    private cartItemService: CartItemService,
    private overlay: OverlayContainer) { }
    filteredProducts: Product[] = [];
    filteredDiscounts: ProductAndDiscount[] = [];
    filterFlag: boolean = false;
    hideFlag: boolean = false;
    discountOnlyFlag: boolean=false;
    

  ngOnInit(): void {
    //add code for the update

    this.userId = this.tokenService.getUser().user_id;
    this.loadDiscountedProducts();

    this.darkModeToggle.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  //Load all all Products
  loadProducts() {
    this.productService.getAllProductsService().subscribe(
      (response) => {

        //Loop to remove duplicated products if theres a discount for it
        for (let index = 0; index < this.allDiscountProducts.length; index++) {
          for (let index2 = 0; index2 < response.length; index2++) {
            if (this.allDiscountProducts[index].productId == response[index2].productId) {
              this.indexArray[this.saveIndex] = index;
              response.splice(index2, 1);
            }
          }
        }
        this.allProducts = response;
      },
      (error) => {
        this.errorProductMsg = "Unable to get allProducts - Try later"
      }
    )
  }

  //Loads all Discounts
  loadDiscountedProducts() {
    this.productService.getAllDiscountsProductsService().subscribe(
      (response) => {
        this.allDiscountProducts = response;
        this.loadProducts();
      },
      (error) => {
        this.errorProductMsg = "Unable to get allDiscountProducts - Try later";
      }
    )
  }

  goToProduct(productId: number) {
    this.router.navigate(['product-page/' + productId]);
  }

  loadCart() {
    this.cartAndItemsService.getCartAndItemsWithUserIdService(this.userId).subscribe({
      next: response => {
        this.cartAndItems = response;
      },
      error: error => {
      }
    });
  }



  addToCart(productId: any) {
    let item = new CartItem();
    item.cartId = this.cartAndItems.cartId;
    item.productId = productId;
    item.cartQty = 1;
    item.cartItemId = -1;
    this.cartItemService.addNewItemService(item).subscribe({
      next: response => {

      },
      error: error => {
      }
    });
  }

  loadWishlist() {
    this.wishlistAndItemsService.getWishlistAndItemsService(this.userId).subscribe({
      next: response => {
        this.wishlistAndItems = response;
      },
      error: error => {
      }
    });
  }

  addToWishlist(productId: any) {
    let itemwishlist = new WishlistItem();
    itemwishlist.wishlistId = this.wishlistAndItems.wishlistId;
    itemwishlist.productId = productId;
    itemwishlist.wishlistQty = 1;
    itemwishlist.wishlistItemId = -1;
    this.wishlistItemService.addNewItemServiceWishlist(itemwishlist).subscribe({
      next: response => {

      },
      error: error => {
      }
    });
  }

  filterByCategory(categoryName: String) {
    this.filteredProducts = [];
    this.filteredDiscounts=[];
    this.allProducts.forEach((product) => {
      if (product.productCategory == categoryName) {this.filteredProducts.push(product)}
    });

    this.allDiscountProducts.forEach((product) => {
      if (product.productCategory == categoryName) {this.filteredDiscounts.push(product)}
    });
    this.hideFlag = true;
    this.filterFlag = true;
    sessionStorage.removeItem("searchQuery");
  }

  filterByDiscount() {
    sessionStorage.removeItem("searchQuery")
    this.discountOnlyFlag=true;
    this.filterFlag=false;
    this.filteredProducts=[];
    this.hideFlag=false;
  }

  unfilter() {
    this.filterFlag=false;
    this.filteredProducts = [];
    sessionStorage.removeItem("searchQuery");
    this.hideFlag = false;
    this.discountOnlyFlag=false;
  }

  returnQuery() {
    return sessionStorage.getItem("searchQuery");
  }

  searchedProducts(searched: string|null): Product[] {
    let returnedSet: Product[] = [];
    if (searched != null) {
      this.filterFlag=false;
      this.hideFlag = true;
      let searchString: string = searched.toLowerCase();
      this.allProducts.forEach((product) => {
        let lowercaseName: string = product.productName.toLowerCase();
        let lowercaseCategory: string = product.productCategory.toLowerCase();
        if (lowercaseName.includes(searchString) || lowercaseCategory.includes(searchString)) {
          returnedSet.push(product);
        }
      });
    }
    return returnedSet;
  }

  searchedDiscounts(searched: string|null): ProductAndDiscount[] {
    let returnedSet: ProductAndDiscount[] = [];
    if (searched != null) {
      this.filterFlag=false;
      this.hideFlag = true;
      let searchString: string = searched.toLowerCase();
      this.allDiscountProducts.forEach((product) => {
        let lowercaseName: string = product.productName.toLowerCase();
        let lowercaseCategory: string = product.productCategory.toLowerCase();
        if (lowercaseName.includes(searchString) || lowercaseCategory.includes(searchString)) {
          returnedSet.push(product);
        }
      });
    }
    return returnedSet;
  }

  searchStore() {
    sessionStorage.setItem("searchQuery", this.searchQuery);
  }
}