import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovTipoProductoRoutingModule } from './lov.tipoProducto.routing';

import { LovTipoProductoComponent } from './componentes/lov.tipoProducto.component';


@NgModule({
  imports: [SharedModule, LovTipoProductoRoutingModule],
  declarations: [LovTipoProductoComponent],
  exports: [LovTipoProductoComponent]
})
export class LovTipoProductoModule { }

