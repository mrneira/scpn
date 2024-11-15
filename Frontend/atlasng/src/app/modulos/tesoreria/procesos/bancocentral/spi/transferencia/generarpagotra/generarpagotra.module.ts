import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { GenerarPagoTraRoutingModule } from './generarpagotra.routing';
import { GenerarPagoTraComponent } from './componentes/generarpagotra.component';
import { JasperModule } from '../../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, GenerarPagoTraRoutingModule, JasperModule,TooltipModule],
  declarations: [GenerarPagoTraComponent]
})
export class GenerarPagoTraModule { }
