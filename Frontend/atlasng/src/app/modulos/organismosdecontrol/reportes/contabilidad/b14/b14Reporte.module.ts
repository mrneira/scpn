import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { B14ReporteRoutingModule } from './b14Reporte.routing';
import { B14ReporteComponent } from './componentes/b14Reporte.component';

@NgModule({
  imports: [SharedModule, B14ReporteRoutingModule ],
  declarations: [B14ReporteComponent]
})
export class B14ReporteModule { }
