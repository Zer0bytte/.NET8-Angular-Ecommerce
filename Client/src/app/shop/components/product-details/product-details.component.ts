import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../shop.service';
import { Product } from 'src/app/shared/models/products';
import { CartService } from 'src/app/_services/cart.service';
import { CartItem } from 'src/app/shared/models/cart';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = {} as Product;
  isInCart: boolean;

  constructor(private route: ActivatedRoute, private shopService: ShopService, 
    public cartService: CartService) {

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

    this.shopService.getSingleProduct(parseInt(id)).subscribe({
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
