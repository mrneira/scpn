import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ProductosPermitidosRoutingModule } from './_productospermitidos.routing';
import { ProductosPermitidosComponent } from './componentes/_productospermitidos.component';

@NgModule({
  imports: [SharedModule, ProductosPermitidosRoutingModule],
  declarations: [ProductosPermitidosComponent],
  exports: [ProductosPermitidosComponent]
})
export class ProductosPermitidosModule { }
