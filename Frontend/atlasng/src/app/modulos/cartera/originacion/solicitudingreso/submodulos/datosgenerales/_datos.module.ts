import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DatosRoutingModule } from './_datos.routing';
import { DatosComponent } from './componentes/_datos.component';
import { ProductoModule } from '../../../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../../../generales/tipoproducto/tipoProducto.module';

@NgModule({
  imports: [SharedModule, DatosRoutingModule, ProductoModule, TipoProductoModule ],
  declarations: [DatosComponent],
  exports: [DatosComponent]
})
export class DatosModule { }
