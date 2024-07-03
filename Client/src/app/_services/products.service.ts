import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationParams } from '../_models/PaginationParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { environment } from 'src/envirnoments/environment.development';
import { Product } from '../_models/products';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }


  getProducts(paginationParams: PaginationParams): Observable<any> {
    let params = getPaginationHeaders(paginationParams.pageNumber, paginationParams.pageSize);
    return getPaginatedResult<Product[]>(this.http, this.baseUrl + 'Products/getProducts', params);
  }

  getSingleProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + 'Products/getProducts/' + productId);
  }
}
