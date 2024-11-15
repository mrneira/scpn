import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PoliciaEstadoReporteRoutingModule } from './policiaEstadoReporte.routing';

import { PoliciaEstadoReporteComponent } from './componentes/policiaEstadoReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module';
import {MultiSelectModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, PoliciaEstadoReporteRoutingModule, JasperModule, LovPersonasModule, MultiSelectModule ],
  declarations: [PoliciaEstadoReporteComponent]
})
export class PoliciaEstadoReporteModule { }
