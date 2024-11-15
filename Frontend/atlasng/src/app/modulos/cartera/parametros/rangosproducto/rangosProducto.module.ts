import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RangosProductoRoutingModule } from './rangosProducto.routing';

import { RangosProductoComponent } from './componentes/rangosProducto.component';
import { LovProductoModule } from '../../../generales/lov/producto/lov.producto.module';
import { LovTipoProductoModule } from '../../../generales/lov/tipoproducto/lov.tipoProducto.module';


@NgModule({
  imports: [SharedModule, RangosProductoRoutingModule, LovProductoModule, LovTipoProductoModule ],
  declarations: [RangosProductoComponent]
})
export class RangosProductoModule { }
