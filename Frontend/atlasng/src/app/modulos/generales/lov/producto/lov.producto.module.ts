import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovProductoRoutingModule } from './lov.producto.routing';

import { LovProductoComponent } from './componentes/lov.producto.component';


@NgModule({
  imports: [SharedModule, LovProductoRoutingModule],
  declarations: [LovProductoComponent],
  exports: [LovProductoComponent]
})
export class LovProductoModule { }

