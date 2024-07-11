import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './shared/models/user';
import { CartService } from './_services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Client';
  constructor(private accountService: AccountService, private cartService: CartService) { }

  ngOnInit(): void {
    const cartId = localStorage.getItem('basket_id');
    if(cartId) this.cartService.getCart(cartId);
    this.getCurrentUser();
  }

  getCurrentUser() {
    var userString = localStorage.getItem('user');
    if (!userString) return;

    const user: User = JSON.parse(userString!!);
    this.accountService.setLoggedUser(user);
  }
}
