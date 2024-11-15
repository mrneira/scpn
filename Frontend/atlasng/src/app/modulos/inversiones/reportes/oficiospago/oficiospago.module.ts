import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OficiospagoRoutingModule } from './oficiospago.routing';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

import { OficiospagoComponent } from './componentes/oficiospago.component';

@NgModule({
  imports: [SharedModule, OficiospagoRoutingModule, JasperModule],
  declarations: [OficiospagoComponent],
  exports: []
})
export class OficiospagoModule { }
