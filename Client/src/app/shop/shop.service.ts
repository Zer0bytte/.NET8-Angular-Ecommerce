import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/envirnoments/environment.development';
import { PaginationParams } from '../shared/models/PaginationParams';
import { Observable } from 'rxjs';
import { getPaginatedResult, getPaginationHeaders } from '../_services/paginationHelper';
import { Product } from '../shared/models/products';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

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
