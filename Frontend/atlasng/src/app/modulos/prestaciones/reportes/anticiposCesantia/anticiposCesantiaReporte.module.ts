import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AnticiposCesantiaReporteRoutingModule } from './anticiposCesantiaReporte.routing';
import {MultiSelectModule} from 'primeng/primeng';
import { AnticiposCesantiaReporteComponent } from './componentes/anticiposCesantiaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, AnticiposCesantiaReporteRoutingModule, JasperModule, LovPersonasModule, MultiSelectModule ],
  declarations: [AnticiposCesantiaReporteComponent]
})
export class AnticiposCesantiaReporteModule { }
