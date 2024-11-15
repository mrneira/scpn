import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstatusSolicitudRoutingModule } from './estatusSolicitud.routing';

import { EstatusSolicitudComponent } from './componentes/estatusSolicitud.component';


@NgModule({
  imports: [SharedModule, EstatusSolicitudRoutingModule ],
  declarations: [EstatusSolicitudComponent]
})
export class EstatusSolicitudModule { }
