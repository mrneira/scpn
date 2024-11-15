import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { B15ReporteRoutingModule } from './b15Reporte.routing';
import { B15ReporteComponent } from './componentes/b15Reporte.component';

@NgModule({
  imports: [SharedModule, B15ReporteRoutingModule ],
  declarations: [B15ReporteComponent]
})
export class B15ReporteModule { }
