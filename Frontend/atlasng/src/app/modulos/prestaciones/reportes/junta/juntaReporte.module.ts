import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JuntaReporteRoutingModule } from './juntaReporte.routing';

import { JuntaReporteComponent } from './componentes/juntaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, JuntaReporteRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [JuntaReporteComponent]
})
export class JuntaReporteModule { }
