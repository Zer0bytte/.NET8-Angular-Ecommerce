import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/products';
import { Order, OrderItem } from 'src/app/shared/models/order';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order;
  constructor(private ordersService: OrdersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.ordersService.getOrderDetails(parseInt(id)).subscribe({
      next: result => {
        this.order = result;
      }
    });
  }

}
