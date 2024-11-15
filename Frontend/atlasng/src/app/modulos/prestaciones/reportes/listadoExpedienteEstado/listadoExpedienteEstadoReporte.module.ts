import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ListadoExpedienteEstadoReporteRoutingModule } from './listadoExpedienteEstadoReporte.routing';
import {MultiSelectModule} from 'primeng/primeng';
import { ListadoExpedienteEstadoReporteComponent } from './componentes/listadoExpedienteEstadoReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, ListadoExpedienteEstadoReporteRoutingModule, JasperModule, LovPersonasModule, MultiSelectModule ],
  declarations: [ListadoExpedienteEstadoReporteComponent]
})
export class ListadoExpedienteEstadoReporteModule { }
