import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { AutorizarModificacionOcpRoutingModule } from './autorizarmodificacionocp.routing';
import { AutorizarModificacionOcpComponent } from './componentes/autorizarmodificacionocp.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AutorizarModificacionOcpRoutingModule, JasperModule,TooltipModule],
  declarations: [AutorizarModificacionOcpComponent]
})
export class AutorizarModificacionOcpModule { }
