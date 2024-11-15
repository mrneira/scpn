import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { AgregarPagoSpiRoutingModule } from './agregarpagospi.routing';
import { AgregarPagoSpiComponent } from './componentes/agregarpagospi.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AgregarPagoSpiRoutingModule, JasperModule,TooltipModule],
  declarations: [AgregarPagoSpiComponent]
})
export class AgregarPagoSpiModule { }
