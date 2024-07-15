import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/envirnoments/environment.development';
import { Order } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getOrders() {
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  getOrderDetails(id: number) {
    return this.http.get<Order>(this.baseUrl + 'orders/' + id);

  }
}
