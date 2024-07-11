import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CartService } from 'src/app/_services/cart.service';
import { CartItem } from 'src/app/shared/models/cart';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  cartList!: CartItem[];
  constructor(private cartService: CartService) { }
  ngOnInit(): void {
    this.getCartList();
  }
  getCartList() {
    this.cartService.cartObservable$.subscribe({
      next: cart => {
        if (cart) this.cartList = cart.cartItems;
      }
    })
  }

}
