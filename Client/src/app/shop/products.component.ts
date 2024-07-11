import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PaginationParams } from 'src/app/shared/models/PaginationParams';
import { Pagination } from 'src/app/shared/models/paginations';
import { Product } from 'src/app/shared/models/products';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('testDiv', { static: false })
  private testDiv: ElementRef<HTMLDivElement>;
  isTestDivScrolledIntoView: boolean;

  products: Product[] = [];
  pagination: Pagination | undefined;
  paginationParams: PaginationParams | undefined;

  constructor(private shopService: ShopService, private router: Router) {
    this.paginationParams = new PaginationParams();
  }

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 4000,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }


  ngOnInit(): void {
    if (this.paginationParams) {

      this.shopService.getProducts(this.paginationParams).subscribe({
        next: data => {
          this.products = data.result!;
          this.pagination = data.pagination;
        },
        error: err => {

        }
      })
    }
  }
  @HostListener('window:scroll', ['$event'])
  isScrolledIntoView() {
    if (this.testDiv) {
      const rect = this.testDiv.nativeElement.getBoundingClientRect();
      const topShown = rect.top >= 0;
      const bottomShown = rect.bottom <= window.innerHeight;
      this.isTestDivScrolledIntoView = topShown && bottomShown;

      if (this.isTestDivScrolledIntoView) {
        // Handle loading more products
        if (this.products.length === this.pagination.totalItems) return;
        this.paginationParams.pageNumber++;
        this.paginationParams.pageSize = 20;
        this.shopService.getProducts(this.paginationParams).subscribe({
          next: data => {
            for (let index = 0; index < data.result.length; index++) {
              const element = data.result[index];
              this.products.push(element);
            }
          }
        })
      }

    }
  }



}
