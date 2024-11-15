import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ListadoExpedienteReporteRoutingModule } from './listadoExpedienteReporte.routing';
import {MultiSelectModule} from 'primeng/primeng';
import { ListadoExpedienteReporteComponent } from './componentes/listadoExpedienteReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, ListadoExpedienteReporteRoutingModule, JasperModule, LovPersonasModule, MultiSelectModule ],
  declarations: [ListadoExpedienteReporteComponent]
})
export class ListadoExpedienteReporteModule { }
