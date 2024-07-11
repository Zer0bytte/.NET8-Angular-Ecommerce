import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/_services/cart.service';
import { CartItem } from '../shared/models/cart';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  isCartEmpty: boolean;
  totalPrice: number = 0;
  cartList!: CartItem[];

  constructor(private fb: FormBuilder, public cartService: CartService, private accountService: AccountService) { }

  checkoutForm: FormGroup = this.fb.group({
    addressForm: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
    }),
    deliveryForm: this.fb.group({
      deliveryMethod: ['', Validators.required]
    }),
    paymentForm: this.fb.group({
      nameOnCard: ['', Validators.required]
    })
  })


  ngOnInit(): void {

    this.accountService.getUserAddress().subscribe({
      next: address => {
        address && this.checkoutForm.get('addressForm')?.patchValue(address);
      }
    })
    this.getCartList();
  }


  getCartList() {
    this.cartService.cartObservable$.subscribe({
      next: cart => {
        if (cart) {
          this.cartList = cart.cartItems;
          this.getTotalPrice();
          this.isCartEmpty = false;
        } else {
          this.isCartEmpty = true;
        }
      }
    })
  }

  getTotalPrice() {
    this.cartService.cartObservable$.subscribe((cart) => {
      this.totalPrice = 0;
      if (cart) {
        cart.cartItems?.map((item) => {
          this.totalPrice += item.product.price! * item.quantity!;
        });
      }
    });
  }

}
