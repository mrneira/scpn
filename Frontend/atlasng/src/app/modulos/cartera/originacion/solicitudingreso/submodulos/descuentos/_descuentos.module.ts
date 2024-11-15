import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DescuentosRoutingModule } from './_descuentos.routing';
import { DescuentosComponent } from './componentes/_descuentos.component';

import { ProductoModule } from '../../../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, DescuentosRoutingModule, ProductoModule, TipoProductoModule ],
  declarations: [DescuentosComponent],
  exports: [DescuentosComponent]
})
export class DescuentosModule { }
