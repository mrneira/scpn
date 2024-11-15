import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { AprobarPagoSpiRoutingModule } from './aprobarpagospi.routing';
import { AprobarPagoSpiComponent } from './componentes/aprobarpagospi.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AprobarPagoSpiRoutingModule, JasperModule,TooltipModule],
  declarations: [AprobarPagoSpiComponent]
})
export class AprobarPagoSpiModule { }
