import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, catchError, map, switchMap, take, throwError } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { environment } from 'src/envirnoments/environment.development';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Injectable()
export class TokenExpirationInterceptor implements HttpInterceptor {
  baseApiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient, private accountService: AccountService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          console.log("Token expired");
          return this.accountService.currentUser$.pipe(
            take(1),
            switchMap(user => {
              if (user && user.refreshToken) {
                return this.http.post<any>(this.baseApiUrl + 'refresh', { refreshToken: user.refreshToken }).pipe(
                  switchMap(response => {
                    this.accountService.setLoggedUser(response);
                    const clonedRequest = request.clone({
                      setHeaders: {
                        Authorization: `Bearer ${response.accessToken}`
                      }
                    });
                    return next.handle(clonedRequest);
                  }),
                  catchError(refreshError => {
                    return throwError(() => new Error(""));
                  })
                );
              } else {
                // If no refresh token is present, log out the user or handle appropriately
                this.router.navigateByUrl('login');
                return throwError(() => new Error(""));
              }
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}