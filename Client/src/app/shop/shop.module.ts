import { NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductCarouselComponent } from './components/product-carousel/product-carousel.component';
import { ProductsComponent } from './products.component';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';


@NgModule({
  declarations: [
    ProductComponent,
    ProductsComponent,
    ProductDetailsComponent,
    ProductCarouselComponent
  ],
  imports: [
    ShopRoutingModule,
    CommonModule,
    CarouselModule,

  ],
  exports: [
  ]
})
export class ShopModule { }
