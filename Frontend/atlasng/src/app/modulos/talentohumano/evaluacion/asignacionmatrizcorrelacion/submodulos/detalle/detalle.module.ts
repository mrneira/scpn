import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DetalleRoutingModule } from './detalle.routing';

import { DetalleComponent } from './componentes/detalle.component';



@NgModule({
  imports: [SharedModule, DetalleRoutingModule],
  declarations: [DetalleComponent],
  exports: [DetalleComponent]
})
export class DetalleModule { }
