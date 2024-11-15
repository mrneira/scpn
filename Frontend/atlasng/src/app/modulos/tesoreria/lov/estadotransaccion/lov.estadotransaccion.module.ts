import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovEstadoTransaccionRoutingModule } from './lov.estadotransaccion.routing';
import { TooltipModule} from 'primeng/primeng';
import { LovEstadoTransaccionComponent } from './componentes/lov.estadotransaccion.component';


@NgModule({
  imports: [SharedModule, LovEstadoTransaccionRoutingModule, TooltipModule],
  declarations: [LovEstadoTransaccionComponent],
  exports: [LovEstadoTransaccionComponent]
})
export class LovEstadoTransaccionModule { }

