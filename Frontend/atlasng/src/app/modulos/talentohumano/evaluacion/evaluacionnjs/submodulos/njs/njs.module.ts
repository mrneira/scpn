import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { NjsDetalleRoutingModule } from './njs.routing';

import { NjsDetalleComponent } from './componentes/njs.component';

@NgModule({
  imports: [SharedModule, NjsDetalleRoutingModule],
  declarations: [NjsDetalleComponent],
  exports: [NjsDetalleComponent]
})
export class NjsDetalleModule { }
