import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product, BundleProduct } from 'src/app/models/product.model';

@Component({
  selector: 'app-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.scss']
})
export class BundleComponent implements OnInit {

  // every property of newBundle should be 2 way bound to the form in the template
  newBundle: BundleProduct = new BundleProduct();
  
  product1: Product[] = [];
  product2: Product[] = [];

  errorProductMsg: string = '';
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
      // fetch all products from the back end
      // refer admin component

this.productService.getAllProductsService().subscribe(
        (response: any) => {
          this.product1 = response;
          this.product2 = response;
                    
        },
        (error: any) => {
          this.errorProductMsg = "Unable to get allProducts - Try later";
        }
      )
  }
createBundle(){
//here use the bundle service and consume the endpoint to create the bundle
  // by passing newBundle


}
}
