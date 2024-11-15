import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { NovedadesReporteRoutingModule } from './novedadesReporte.routing';
import {MultiSelectModule} from 'primeng/primeng';
import { NovedadesReporteComponent } from './componentes/novedadesReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, NovedadesReporteRoutingModule, JasperModule, LovPersonasModule, MultiSelectModule ],
  declarations: [NovedadesReporteComponent]
})
export class NovedadesReporteModule { }
