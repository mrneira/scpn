import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MiembrosBajaReporteRoutingModule } from './miembrosBajaReporte.routing';

import { MiembrosBajasReporteComponent } from './componentes/miembrosBajasReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import {MultiSelectModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, MiembrosBajaReporteRoutingModule, JasperModule, LovPersonasModule, MultiSelectModule ],
  declarations: [MiembrosBajasReporteComponent]
})
export class MiembrosBajaReporteModule { }
