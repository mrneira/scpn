import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { B16ReporteRoutingModule } from './b16Reporte.routing';

import { B16ReporteComponent } from './componentes/b16Reporte.component';
//import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, B16ReporteRoutingModule ],
  declarations: [B16ReporteComponent]
})
export class B16ReporteModule { }
