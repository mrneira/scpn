import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { GenerarComprobanteRoutingModule } from './generarcomprobante.routing';
import { GenerarComprobanteComponent } from './componentes/generarcomprobante.component';
import { JasperModule } from '../../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, GenerarComprobanteRoutingModule, JasperModule,TooltipModule],
  declarations: [GenerarComprobanteComponent]
})
export class GenerarComprobanteModule { }
