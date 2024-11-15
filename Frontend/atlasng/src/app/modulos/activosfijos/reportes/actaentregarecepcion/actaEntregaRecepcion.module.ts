import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ActaEntregaRecepcionRoutingModule } from './actaEntregaRecepcion.routing';
import { ActaEntregaRecepcionComponent } from './componentes/actaEntregaRecepcion.component';
import { LovActasModule } from '../../lov/actas/lov.actas.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ActaEntregaRecepcionRoutingModule,LovActasModule,TooltipModule],
  declarations: [ActaEntregaRecepcionComponent]
})
export class ActaEntregaRecepcionModule { }
