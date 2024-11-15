import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { IntrnaDetalleRoutingModule } from './internadetalle.routing';

import { InternaDetalleComponent } from './componentes/internadetalle.component';

@NgModule({
  imports: [SharedModule, IntrnaDetalleRoutingModule],
  declarations: [InternaDetalleComponent],
  exports: [InternaDetalleComponent]
})
export class InternaDetalleModule { }
