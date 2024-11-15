import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoResultadosReporteRoutingModule } from './estadoResultadosReporte.routing';

import { EstadoResultadosReporteComponent } from './componentes/estadoResultadosReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import {CheckboxModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, EstadoResultadosReporteRoutingModule, JasperModule, LovPersonasModule, CheckboxModule,TabViewModule ],
  declarations: [EstadoResultadosReporteComponent]
})
export class EstadoResultadosReporteModule { }
