import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SeguroProductoRoutingModule } from './seguroProducto.routing';

import { SeguroProductoComponent } from './componentes/seguroProducto.component';

@NgModule({
  imports: [SharedModule, SeguroProductoRoutingModule],
  declarations: [SeguroProductoComponent]
})
export class SeguroProductoModule { }
