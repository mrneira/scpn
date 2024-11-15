import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { EliminarPagoSpiRoutingModule } from './eliminarpagospi.routing';
import { EliminarPagoSpiComponent } from './componentes/eliminarpagospi.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, EliminarPagoSpiRoutingModule, JasperModule,TooltipModule],
  declarations: [EliminarPagoSpiComponent]
})
export class EliminarPagoSpiModule { }
