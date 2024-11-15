import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ProductosRoutingModule } from './_productos.routing';
import { ProductosComponent } from './componentes/_productos.component';

@NgModule({
  imports: [SharedModule, ProductosRoutingModule],
  declarations: [ProductosComponent],
  exports: [ProductosComponent]
})
export class ProductosModule { }
