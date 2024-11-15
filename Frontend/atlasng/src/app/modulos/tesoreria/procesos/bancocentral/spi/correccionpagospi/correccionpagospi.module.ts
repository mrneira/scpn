import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CorreccionPagoSpiRoutingModule } from './correccionpagospi.routing';
import { CorreccionPagoSpiComponent } from './componentes/correccionpagospi.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CorreccionPagoSpiRoutingModule, JasperModule,TooltipModule],
  declarations: [CorreccionPagoSpiComponent]
})
export class CorreccionPagoSpiModule { }
