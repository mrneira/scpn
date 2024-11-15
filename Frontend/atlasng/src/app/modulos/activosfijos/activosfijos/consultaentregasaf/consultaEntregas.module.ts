import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaEntregasRoutingModule } from './consultaEntregas.routing';
import { ConsultaEntregasComponent } from './componentes/consultaEntregas.component';
import { LovActasModule } from '../../lov/actas/lov.actas.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ConsultaEntregasRoutingModule,LovActasModule,TooltipModule],
  declarations: [ConsultaEntregasComponent]
})
export class ConsultaEntregasModule { }
