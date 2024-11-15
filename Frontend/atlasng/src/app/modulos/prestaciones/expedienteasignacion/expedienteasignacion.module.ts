
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ExpedienteAsignacionRoutingModule } from './expedienteasignacion.routing';
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';
import { ExpedienteAsignacionComponent } from './componentes/expedienteasignacion.component';
import { StepsModule } from 'primeng/primeng';
@NgModule({
  imports: [
    StepsModule,
    SharedModule, 
    ExpedienteAsignacionRoutingModule, 
    LovPersonasModule,
    JasperModule,
    TooltipModule
  ],  
  declarations: [
    ExpedienteAsignacionComponent
  ], 
  exports: [
    ExpedienteAsignacionComponent
  ]
})
export class ExpedienteAsignacionModule { }