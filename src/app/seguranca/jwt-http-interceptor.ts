import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpRequest,
  HttpEvent,
  HttpInterceptor,
  HttpHandler
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JwtHttpInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token && request.url.indexOf('/oauth/token') === -1) {
      request = request.clone({
        setHeaders: {
          Accept: `application/json`,
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
