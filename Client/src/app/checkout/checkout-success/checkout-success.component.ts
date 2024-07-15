import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent {
  orderId: number;
  constructor(router: Router,activ:ActivatedRoute) {
    const order = router.getCurrentNavigation().extras.state as Order;
    this.orderId = order.id;
  }
}
