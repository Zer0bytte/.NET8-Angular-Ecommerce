import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/_models/cart';
import { Product } from 'src/app/_models/products';
import { CartService } from 'src/app/_services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input('product') product: Product;
  constructor(private router: Router, public cartService: CartService) { }

  addToShoppingCart(product: Product) {
    const cartItem: CartItem = {
      product: product,
      quantity: 1
    };
    this.cartService.setCartItem(cartItem);
  }


  viewProduct(product: Product) {
    this.router.navigateByUrl('/products/' + product.id);
  }



}
