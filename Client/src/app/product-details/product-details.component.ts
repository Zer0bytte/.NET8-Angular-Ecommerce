import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../_models/products';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../_services/products.service';
import { CartService } from '../_services/cart.service';
import { CartItem } from '../_models/cart';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = {} as Product;
  isInCart: boolean;

  constructor(private route: ActivatedRoute, private productsService: ProductsService, public cartService: CartService) {

  }

  addToCart(prod: Product) {
    debugger;
    const cartItem: CartItem = {
      product: prod,
      quantity: 1
    };
    this.cartService.setCartItem(cartItem);
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.productsService.getSingleProduct(parseInt(id)).subscribe({
      next: product => {
        this.product = product;
        this.cartService.cartObservable$.subscribe({
          next: products => {
            console.log(products);
            const isItemExist = products.cartItems?.find(item => item.product.id == parseInt(id));

            this.isInCart = isItemExist ? true : false;
          }
        })
      }
    });


  }


}
