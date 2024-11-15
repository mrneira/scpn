import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ListadoExpedienteAuditoriaReporteRoutingModule } from './listadoExpedienteAuditoriaReporte.routing';

import { ListadoExpedienteAuditoriaReporteComponent } from './componentes/listadoExpedienteAuditoriaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, ListadoExpedienteAuditoriaReporteRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [ListadoExpedienteAuditoriaReporteComponent]
})
export class ListadoExpedienteAuditoriaReporteModule { }
