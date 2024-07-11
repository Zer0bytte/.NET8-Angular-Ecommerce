import { Injectable } from '@angular/core';
import { BehaviorSubject, EmptyError, Observable, of } from 'rxjs';
import { Address, User } from '../shared/models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/envirnoments/environment.development';
import { LoginModel } from '../shared/models/loginModel';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseApiUrl: string = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  user: User = {} as User;
  constructor(private http: HttpClient) { }

  login(loginModel: LoginModel) {
    return this.http.post<User>(this.baseApiUrl + 'login', loginModel);
  }

  setLoggedUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.currentUserSource.next(user);
  }

  isLoggedIn(): boolean {
    const userItem = localStorage.getItem('user');
    if (userItem != undefined)
      return true;

    return false;
  }

  refreshToken() {
    const userJson = localStorage.getItem('user');
    const user: User = JSON.parse(userJson);
    return this.http.post(this.baseApiUrl + 'refresh', { refreshToken: user.refreshToken });
  }


  getUserAddress(){
    return this.http.get<Address>(this.baseApiUrl + 'account');
  }

}
