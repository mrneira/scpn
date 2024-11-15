import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { SolicitudRoutingModule } from './solicitud.routing';

import { SolicitudComponent } from './componentes/solicitud.component';

@NgModule({
  imports: [SharedModule, SolicitudRoutingModule ],
  declarations: [SolicitudComponent]
})
export class SolicitudModule { }
