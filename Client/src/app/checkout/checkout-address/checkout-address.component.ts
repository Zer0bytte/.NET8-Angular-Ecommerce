import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CartComponent } from 'src/app/core/cart/cart.component';

@Component({
  providers: [CartComponent],
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent {
  @Input() checkoutForm?: FormGroup;
  constructor(public cartComponent: CartComponent) {
    cartComponent.openCartlist();
  }
}
