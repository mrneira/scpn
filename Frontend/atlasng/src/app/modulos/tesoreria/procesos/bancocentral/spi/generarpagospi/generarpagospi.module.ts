import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { GenerarPagoSpiRoutingModule } from './generarpagospi.routing';
import { GenerarPagoSpiComponent } from './componentes/generarpagospi.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, GenerarPagoSpiRoutingModule, JasperModule,TooltipModule],
  declarations: [GenerarPagoSpiComponent]
})
export class GenerarPagoSpiModule { }
