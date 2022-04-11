import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product, ProductAndDiscount, Discount, Bundle } from 'src/app/models/product.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  row: any;
  toggleDiscountTable: boolean = false;
  toggleProductTable: boolean = false;
  toggleBundleTable: boolean = false;
  //Arrays, Objects, & string
  allProducts: Product[] = [];
  allBundles: Bundle[] = [];

  productObject: Product = new Product();
  formValue         !: FormGroup;
  formValueProduct  !: FormGroup;
  formValueBundle  !: FormGroup;
  formValueDiscount !: FormGroup;
  formValueDiscountDelete !: FormGroup;
  formValueDiscountUpdate !: FormGroup;
  errorProductMsg: string = '';
  storeImgUrl :  string = '';

  //Array for Form Fields to add new Product
  newProduct: Product = {
    productId: 0,
    productSku: "",
    productName: "",
    productDescription: "",
    productCategory: "",
    productCost: 0,
    productQty: 0,
    productRemoved: false,
    imageUrl: ""
  }
//Bundle
  //Array for Form Fields to Create new Bundle
  newBundle: Bundle = {
    bundleId: 0,
    bundleName: "",
    bundlePercentage: 0.0,
    productOnePojo: new Product(),
    productTwoPojo: new Product()
  
  }
  addBundle: Bundle = {

    bundleName: "",
    bundlePercentage: 0.0,
    productOnePojo: new Product(),
    productTwoPojo: new Product()
  
  }

  //To Provide Different Product Categories in add product form
  public selectedCat: string = "Phone";
  categories = [
    {value : 'Laptop',          text : 'Laptop'},
    {value : 'Phones',          text : 'Phones'},
    {value : 'Gaming Consoles', text : 'Gaming Consoles'},
    {value : 'TV & Video',      text : 'TV & Video'},
    {value : 'HeadPhones',      text : 'HeadPhones'},
    {value : 'Video Games',     text : 'Video Games'},
    {value : 'Cameras',         text : 'Cameras'}
  ]

  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private productService: ProductService,
    private fileUploadService: FileUploadService) { }
    ngOnInit(): void {
      //for the modal input type form value
      this.formValue = this.formbuilder.group({
        //For generating random SKU String
        product_sku: [ this.getRandomString()],
        product_name: ['' ,[Validators.required]],
        product_cost: ['',[Validators.required]],
        product_category: ['',[Validators.required]],
        product_description: ['',[Validators.required]],
        product_qty: ['',[Validators.required]],
        image_url: ['',[Validators.required]]
      })

    this.formValueProduct = this.formbuilder.group({
      product_sku: [this.getRandomString()],
      product_name: ['',[Validators.required]],
      product_cost: ['',[Validators.required]],
      product_category: ['',[Validators.required]],
      product_description: ['',[Validators.required]],
      product_qty: ['',[Validators.required]],
      image_url: ['',[Validators.required]]
    })

    this.formValueDiscount = this.formbuilder.group({
      discount_percentage: [''],
      discount_description: [''],
      product_id: ['']
    })
    this.formValueBundle = this.formbuilder.group({
      bundle_id: [''],
      bundle_name: [''],
      bundle_percentage: [''],
      product_one_id: [''],
      product_two_id: ['']
    })

    this.formValueDiscountDelete = this.formbuilder.group({
      product_id: [''],
      discount_id: ['']
    })

    this.formValueDiscountUpdate = this.formbuilder.group({
      discount_percentage: [''],
      discount_description: ['']
    })
    //Load all Products
    this.loadDiscountProducts();
    this.loadProducts();
      // load all bundles
      this.loadBundles();
  }

  //Toggle Buttons
  displayProducts(){
    this.toggleProductTable=true;
    this.toggleDiscountTable=false;
    this.toggleBundleTable=false;

    // if(this.toggleDiscountTable==false){
     
    //    this.toggleProductTable=true;
    //    this.toggleDiscountTable=false;
    //   this.ngOnInit();
    // } else{
    //    this.toggleProductTable=false;
    // }
  }

    displayDiscounts(){
      this.toggleDiscountTable=true;
      this.toggleProductTable=false;
      this.toggleBundleTable=false;
      // if(this.toggleProductTable==false){
      //   // this.toggleProductTable==true;
      //   this.toggleDiscountTable=true;
      //   this.toggleProductTable=false;
      // } else{
      //   this.toggleProductTable=false;
      // }

  }

  
  //Load all all Products
  loadProducts() {
    this.productService.getAllProductsService().subscribe(
      (response: any) => {

        //Loop to remove duplicated products if theres a discount for it
        for (let index = 0; index < this.allDiscountProducts.length; index++) {
          for (let index2 = 0; index2 < response.length; index2++) {
            if (this.allDiscountProducts[index].productId == response[index2].productId) {
              response.splice(index2, 1);
            }
          }
        }
        this.allProducts = response;
      },
      (error: any) => {
        this.errorProductMsg = "Unable to get allProducts - Try later";
      }
    )
  }

  public uploadImage(imageInput: any) {
    this.fileUploadService.onUpload(imageInput.target.files[0]).subscribe({
      next: async (response: string) => {
        this.productObject.imageUrl = response;
        this.newProduct.imageUrl = response;

      },
      error: (err: any) => {
      }
    })

  }

  displayBundles(){
  
    this.toggleBundleTable=true;
    this.toggleProductTable=false;
    this.toggleDiscountTable=false;
   this.loadBundles();
    
  }
  
  // to add Product
  addProducts() {
    this.newProduct.productSku = this.formValueProduct.value.product_sku;
    this.newProduct.productName = this.formValueProduct.value.product_name;
    this.newProduct.productCost = this.formValueProduct.value.product_cost;
    this.newProduct.productCategory = this.formValueProduct.value.product_category;
    this.newProduct.productDescription = this.formValueProduct.value.product_description;
    this.newProduct.productQty = this.formValueProduct.value.product_qty;

    // Let's post the data through the post request in service
    if(this.newProduct.productCost > 0 &&  this.newProduct.productQty>0){
    this.productService.addProductsService(this.newProduct).subscribe(
      (response: any) => {
        this.loadProducts();
      },
      (error: any) => {
      })

    this.ngOnInit();
    alert("Product was added successfully");
    //Close the Form Automatically
    let ref = document.getElementById("cancel");
    ref?.click();
    this.formValue.reset();
    this.router.navigate(['admin'])
    }else{
      alert("Make sure to enter values above 0 for Product Cost and Product Quantity");
    }
  }
// Load Bundles
loadBundles() {
  this.productService.getAllBundleProductsService().subscribe(
    (response: any) => {
console.log(response);
    
      this.allBundles = response;
    },
    (error: any) => {
      this.errorProductMsg = "Unable to get allBundles - Try later";
    }
  )
}
  // Bundle
  // to Create Bundle
  addBundles(): void {
    // this.newBundle.bundleId = this.formValueBundle.value.bundle_id;
    this.addBundle.bundleName = this.formValueBundle.value.bundle_name;
    this.addBundle.bundlePercentage = this.formValueBundle.value.bundle_percentage;
    this.addBundle.productOnePojo.productId = this.formValueBundle.value.product_one_id;
    this.addBundle.productTwoPojo.productId = this.formValueBundle.value.product_two_id;

    //console.log(this.newBundle);

    // Let's post the data through the post request in service
    this.productService.addBundleProductsService(this.addBundle).subscribe(
      () => {
        //console.log(response);
        this.loadBundles();
        //console.log(response);

      },
      (error: any) => {
      })

    this.ngOnInit();
    alert("Bundle was added successfully");
    //Close the Form Automatically
    let ref = document.getElementById("cancel");
    ref?.click();
    this.formValue.reset();
    this.router.navigate(['admin'])

  }

  //Bundle -end

  //As per Poon no direct code to be used for refreshing the S.P.A. 
  // reloadPage(): void {
  //   window.location.reload();
  // }


// this.reloadPage();
  //Method to set the new values on to the modal table rows
  onEditRow(row: any) {
    this.productObject.productId = row.productId;
    //The input Text fields to change values for
    this.formValue.controls["product_sku"].setValue(row.productSku);
    this.formValue.controls["product_name"].setValue(row.productName);
    this.formValue.controls["product_cost"].setValue(row.productCost);
    this.formValue.controls["product_category"].setValue(row.productCategory);
    this.formValue.controls["product_description"].setValue(row.productDescription);
    this.formValue.controls["product_qty"].setValue(row.productQty);
    //To Prevent image being lost - store its url in a variable here
    this.storeImgUrl =  row.imageUrl;
    this.formValue.controls["image_url"].setValue(this.productObject.imageUrl);

    //Reload the page
    this.loadProducts();
  }
  //method to update the product
  updateProducts() {
    this.productObject.productSku = this.formValue.value.product_sku;
    this.productObject.productName = this.formValue.value.product_name;
    this.productObject.productCost = this.formValue.value.product_cost;
    this.productObject.productCategory = this.formValue.value.product_category;
    this.productObject.productDescription = this.formValue.value.product_description;
    this.productObject.productQty = this.formValue.value.product_qty;
    //To Prevent image being lost on update.
    //We use the same Store Image variable above, check if product image is empty
    // if Yes assign storeImgUrl to it. 
    if(this.productObject.imageUrl == '' ){
      // check if image url is updated or not
      this.productObject.imageUrl = this.storeImgUrl;
    }
    
    //add more later if needed
    if(this.productObject.productCost > 0 && this.productObject.productQty > 0){
    this.productService.updateProductsService(this.productObject).subscribe(
      (response) => {
        alert("Product was updated successfully");
        //Let's reload the page once update is done
        this.router.navigate(['admin']);
        //Close the Form Automatically
        let ref = document.getElementById("cancel");
        ref?.click();
        this.formValue.reset();
        this.router.navigate(['admin'])
        //Reload the page
        this.loadProducts();
      })
    } else {
      alert("Make sure to enter values above 0 for Product Cost and Product Quantity");
    }
  }
  // delete a product
  deleteProduct(pId: number) {
    //Confirm with user before deleting a Product
    if(confirm("Are you sure to delete this product id: " + pId)) {
      this.productService.deleteProductsService(pId).subscribe(
        (Response: any) => {
          this.loadProducts();
        },
      )
    }
  }
  //--------- ProductAndDiscount Section------------//
  allDiscountProducts: ProductAndDiscount[] = [];
  discountObject: Discount = new Discount;
  deleteDiscountId: number = 0;
  deleteProductId: number = 0;
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

  newDiscount: Discount = {
    discountId: 0,
    productId: 0,
    discountDescription: "",
    discountPercentage: 0.0
  }

  //For loading all Discount Products
  loadDiscountProducts() {
    this.productService.getAllDiscountsProductsService().subscribe(
      (response: ProductAndDiscount[]) => {
        this.allDiscountProducts = response;
        this.loadProducts();
      },
      (error: any) => {
        this.errorProductMsg = "Unable to get allDiscountProducts - Try later";
      }
    )
  }
  //For adding Discount Products
  addDiscountProducts() {
    this.newDiscount.discountPercentage = this.formValueDiscount.value.discount_percentage;
    this.newDiscount.discountDescription = this.formValueDiscount.value.discount_description;
    // this.newDiscount.productId = this.formValueDiscount.value.product_id;

    //recieves the productID from OnEditRow(row)
    this.newDiscount.productId = this.discountObject.productId;

    // Let's post the data through the post request in service
    if(this.newDiscount.discountPercentage > 0){
    this.productService.addDiscountService(this.newDiscount).subscribe(
      (response: any) => {
        this.loadDiscountProducts();
        this.loadProducts();
      },
      (error: any) => {
      })
    alert("Discounted was added successfully");
    //Close the Form Automatically
    let ref = document.getElementById("cancel");
    ref?.click();
    this.formValue.reset();
    this.router.navigate(['admin'])
    //Reload the page
    this.loadDiscountProducts();
    this.loadProducts();
    } else{
      alert("Invalid number: "+this.newDiscount.discountPercentage+ " Make sure the percentage is a positive value")
    }
  }
  // for updating Discount Products
  updateDiscountProducts() {
    this.discountObject.discountPercentage = this.formValueDiscount.value.discount_percentage;
    this.discountObject.discountDescription = this.formValueDiscount.value.discount_description;
    //add more later if needed
    if(this.discountObject.discountPercentage>0){
    this.productService.updateDiscountService(this.discountObject).subscribe(
      (response: any) => {
        //Let's reload the page once update is done
        this.router.navigate(['admin']);
        //Close the Form Automatically
        alert("Discount was updated successfully");
        let ref = document.getElementById("cancel");
        ref?.click();
        this.formValueDiscount.reset();
        this.router.navigate(['admin'])
        //Reload the page
        this.loadDiscountProducts();
      })
    } else{
      alert("Invalid number: "+this.newDiscount.discountPercentage+ " Make sure the percentage is a positive value")
    }
  }
  //For Deleting Discount Products
  deleteDiscountProducts() {
    //Confirm with user before deleting a Discount Product
    if(confirm("Are you sure to delete this discount product id: " + this.deleteDiscountId)) {

      this.productService.deleteDiscountService(this.deleteDiscountId).subscribe(
        (Response: any) => {
          this.loadDiscountProducts();
          this.loadProducts();
        },
      )
    }
  }
  //For Deleting Discount Products
  deleteProductsAlongWithDiscounts() {
    //Confirm with user before deleting a Discount Product
    if(confirm("Are you sure you want to delete this discount id: " + this.deleteDiscountId+", along with product id: "+this.deleteProductId)) {

      this.productService.deleteDiscountService(this.deleteDiscountId).subscribe(
        (Response: any) => {
          this.loadDiscountProducts();
          this.loadProducts();
        },
      )
      this.productService.deleteProductsService(this.deleteProductId).subscribe(
        (Response: any) => {
          this.loadDiscountProducts();
          this.loadProducts();
        },
      )
    }
  }

  //Method to set the new values on to the modal table rows
  onDiscountEditRow(row: any) {
    this.discountObject.discountId = row.discountId;
    this.discountObject.productId = row.productId;
    //The input Text fields to change values for
    //To add discounts
    this.formValueDiscount.controls["discount_percentage"].setValue(row.discountPercentage);
    this.formValueDiscount.controls["discount_description"].setValue(row.discountDescription);
    //To update discounts
    this.formValueDiscountUpdate.controls["discount_percentage"].setValue(row.discountPercentage);
    this.formValueDiscountUpdate.controls["discount_description"].setValue(row.discountDescription);
    //To Delete discounts/products
    this.formValueDiscountDelete.controls["product_id"].setValue(row.productId);
    this.formValueDiscountDelete.controls["discount_id"].setValue(row.discountId);
    this.deleteProductId = row.productId;
    this.deleteDiscountId = row.discountId;
    //To update products on discount-side
    this.productObject.productId = row.productId;
    //The input Text fields to change values for
    this.formValue.controls["product_sku"].setValue(row.productSku);
    this.formValue.controls["product_name"].setValue(row.productName);
    this.formValue.controls["product_cost"].setValue(row.productCost);
    this.formValue.controls["product_category"].setValue(row.productCategory);
    this.formValue.controls["product_description"].setValue(row.productDescription);
    this.formValue.controls["product_qty"].setValue(row.productQty);
    //To Prevent image being lost - store its url in a variable here
    this.storeImgUrl =  row.imageUrl;
    this.formValue.controls["image_url"].setValue(this.productObject.imageUrl);
    //Reload the page
    this.loadDiscountProducts();
    this.loadProducts();
  }

  //Automatically generate random string for Product SKU
  getRandomString() {
    let randomChars = 'AB2C13EH45IK67LM8PR9SXY';
    let result = '';
    for ( var i = 0; i < randomChars.length; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  


}//end class