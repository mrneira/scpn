import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SolicitudRequisitosRoutingModule } from './solicitudrequisitos.routing';

import { LovSolicitudesModule } from './../../lov/solicitudes/lov.solicitudes.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovRequisitosModule } from './../../lov/requisitos/lov.requisitos.module';
import { SolicitudRequisitosComponent } from './componentes/solicitudrequisitos.component';


@NgModule({
  imports: [SharedModule, SolicitudRequisitosRoutingModule, LovPersonasModule, LovSolicitudesModule, LovRequisitosModule ],
  declarations: [SolicitudRequisitosComponent]
})
export class SolicitudRequisitosModule { }
