import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultasolicitudRoutingModule } from './consultasolicitud.routing';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovSolicitudesModule } from '../../lov/solicitudes/lov.solicitudes.module';

import { ConsultasolicitudComponent } from './componentes/consultasolicitud.component';

@NgModule({
  imports: [SharedModule, ConsultasolicitudRoutingModule, LovPersonasModule, LovSolicitudesModule],
  declarations: [ConsultasolicitudComponent]
})
export class ConsultasolicitudModule { }
