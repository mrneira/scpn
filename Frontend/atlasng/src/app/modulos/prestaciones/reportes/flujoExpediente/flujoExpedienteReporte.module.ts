import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { FlujoExpedienteReporteRoutingModule } from './flujoExpedienteReporte.routing';
import {MultiSelectModule} from 'primeng/primeng';
import { FlujoExpedienteReporteComponent } from './componentes/flujoExpedienteReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, FlujoExpedienteReporteRoutingModule, JasperModule, LovPersonasModule, MultiSelectModule ],
  declarations: [FlujoExpedienteReporteComponent]
})
export class FlujoExpedienteReporteModule { }
