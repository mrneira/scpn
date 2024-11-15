import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaAfechaRoutingModule } from './consultaAfecha.routing';
import { ConsultaAfechaComponent } from './componentes/consultaAfecha.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
//import { LovCuentasContablesModule } from './../../lov/partidagasto/componentes/lov.partidagasto.component';
import { LovPartidaGastoModule } from './../../lov/partidagasto/lov.partidagasto.module';
import { TooltipModule} from 'primeng/primeng'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [
    SharedModule, 
    ConsultaAfechaRoutingModule, 
    LovPersonasModule, 
    LovPartidaGastoModule,TooltipModule,JasperModule ],
  declarations: [ConsultaAfechaComponent],
  exports: [ConsultaAfechaComponent]
})
export class ConsultaAfechaModule { }
