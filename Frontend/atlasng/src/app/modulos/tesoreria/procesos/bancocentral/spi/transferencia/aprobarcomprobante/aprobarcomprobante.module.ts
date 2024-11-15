import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { AprobarComprobanteRoutingModule } from './aprobarcomprobante.routing';
import { AprobarComprobanteComponent } from './componentes/aprobarcomprobante.component';
import { JasperModule } from '../../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AprobarComprobanteRoutingModule, JasperModule,TooltipModule],
  declarations: [AprobarComprobanteComponent]
})
export class AprobarComprobanteModule { }
