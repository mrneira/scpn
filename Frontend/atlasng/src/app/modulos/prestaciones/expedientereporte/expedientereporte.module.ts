
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ExpedienteReporteRoutingModule } from './expedientereporte.routing';
import { TooltipModule} from 'primeng/primeng';
import { ExpedienteReporteComponent } from './componentes/expedientereporte.component';
import { StepsModule } from 'primeng/primeng';
@NgModule({
  imports: [
    StepsModule,
    SharedModule, 
    ExpedienteReporteRoutingModule, 
    TooltipModule
  ],  
  declarations: [
    ExpedienteReporteComponent
  ], 
  exports: [
    ExpedienteReporteComponent
  ]
})
export class ExpedienteReporteModule { }