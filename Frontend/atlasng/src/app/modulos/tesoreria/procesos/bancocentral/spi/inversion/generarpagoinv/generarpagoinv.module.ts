import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { GenerarPagoInvRoutingModule } from './generarpagoinv.routing';
import { GenerarPagoInvComponent } from './componentes/generarpagoinv.component';
import { JasperModule } from '../../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, GenerarPagoInvRoutingModule, JasperModule,TooltipModule],
  declarations: [GenerarPagoInvComponent]
})
export class GenerarPagoInvModule { }
