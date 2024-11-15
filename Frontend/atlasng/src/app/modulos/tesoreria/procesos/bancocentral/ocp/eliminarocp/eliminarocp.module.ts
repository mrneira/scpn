import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { EliminarOcpRoutingModule } from './eliminarocp.routing';
import { EliminarOcpComponent } from './componentes/eliminarocp.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, EliminarOcpRoutingModule, JasperModule,TooltipModule],
  declarations: [EliminarOcpComponent]
})
export class EliminarOcpModule { }
