import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TipoProductoRoutingModule } from './tipoProducto.routing';

import { TipoProductoComponent } from './componentes/tipoProducto.component';


@NgModule({
  imports: [SharedModule, TipoProductoRoutingModule ],
  declarations: [TipoProductoComponent]
})
export class TipoProductoModule { }
