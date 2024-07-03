import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from 'src/app/_models/cart';
import { CartService } from 'src/app/_services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  placeOrder() {
    throw new Error('Method not implemented.');
  }

  checkoutFormGroup!: FormGroup;
  isCartEmpty: boolean;
  isSubmitted: boolean;
  totalPrice: number = 0;
  cartList!: CartItem[];

  constructor(private fb: FormBuilder, private cartService: CartService) { }
  ngOnInit(): void {
    this.initCheckoutForm();
    this.getCartList();
  }


  getCartList() {
    this.cartService.cartObservable$.subscribe({
      next: cart => {
        this.cartList = cart.cartItems;
        this.getTotalPrice();
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




  initCheckoutForm() {
    this.checkoutFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      // city: ['', Validators.required],
      // country: ['', Validators.required],
      postalcode: ['', Validators.required],
      message: [''],
      zip: ['', Validators.required],
      house: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}
