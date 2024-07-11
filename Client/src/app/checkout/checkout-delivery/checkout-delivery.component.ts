import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';
import { CartService } from 'src/app/_services/cart.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm?: FormGroup;
  deliveryMethods: DeliveryMethod[] = [];
  constructor(private checkoutService: CheckoutService, public cartService: CartService) { }


  setShippingPrice(dm: DeliveryMethod) {
    this.cartService.setShippingPrice(dm);
  }


  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: dms => {
        this.deliveryMethods = dms;
      }
    })
  }
}
