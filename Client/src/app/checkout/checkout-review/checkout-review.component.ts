import { CdkStepper } from '@angular/cdk/stepper';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Notyf } from 'notyf';
import { CartService } from 'src/app/_services/cart.service';
import { CartItem } from 'src/app/shared/models/cart';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  cartList!: CartItem[];
  @Input() stepper: CdkStepper;

  constructor(private cartService: CartService) { }
  ngOnInit(): void {
    this.getCartList();
  }


  createPaymentIntnet() {
    var not = new Notyf();
    this.cartService.createPaymentIntent().subscribe({
      next: () => {
        this.stepper.next();
      },
      error: err => {
        not.error(err.message);

      }
    })
  }
  getCartList() {
    this.cartService.cartObservable$.subscribe({
      next: cart => {
        if (cart) this.cartList = cart.cartItems;
      }
    })
  }

}
