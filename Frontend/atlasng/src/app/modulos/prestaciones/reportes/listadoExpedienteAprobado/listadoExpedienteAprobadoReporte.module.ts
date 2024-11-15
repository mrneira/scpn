import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ListadoExpedienteAprobadoReporteRoutingModule } from './listadoExpedienteAprobadoReporte.routing';

import { ListadoExpedienteAprobadoReporteComponent } from './componentes/listadoExpedienteAprobadoReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, ListadoExpedienteAprobadoReporteRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [ListadoExpedienteAprobadoReporteComponent]
})
export class ListadoExpedienteAprobadoReporteModule { }
