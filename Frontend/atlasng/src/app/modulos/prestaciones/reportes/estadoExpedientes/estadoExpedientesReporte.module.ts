import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoExpedientesReporteRoutingModule } from './estadoExpedientesReporte.routing';

import { EstadoExpedientesReporteComponent } from './componentes/estadoExpedientesReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, EstadoExpedientesReporteRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [EstadoExpedientesReporteComponent]
})
export class EstadoExpedientesReporteModule { }
