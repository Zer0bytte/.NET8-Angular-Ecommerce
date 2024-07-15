import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/products';
import { CartService } from 'src/app/_services/cart.service';
import { CartItem } from 'src/app/shared/models/cart';

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
      id: product.id,
      category: product.category,
      imageUrl: product.images[0].imageUrl,
      price: product.price,
      title: product.title,
      quantity: 1
    };
    this.cartService.setCartItem(cartItem);
  }


  viewProduct(product: Product) {
    this.router.navigateByUrl('/products/' + product.id);
  }



}
