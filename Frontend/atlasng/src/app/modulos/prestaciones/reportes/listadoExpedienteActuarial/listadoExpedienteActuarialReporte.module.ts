import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ListadoExpedienteActuarialReporteRoutingModule } from './listadoExpedienteActuarialReporte.routing';
import {MultiSelectModule} from 'primeng/primeng';
import { ListadoExpedienteActuarialReporteComponent } from './componentes/listadoExpedienteActuarialReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, ListadoExpedienteActuarialReporteRoutingModule, JasperModule, LovPersonasModule, MultiSelectModule ],
  declarations: [ListadoExpedienteActuarialReporteComponent]
})
export class ListadoExpedienteActuarialReporteModule { }
