import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CorreccionOcpRoutingModule } from './correccionocp.routing';
import { CorreccionOcpComponent } from './componentes/correccionocp.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CorreccionOcpRoutingModule, JasperModule,TooltipModule],
  declarations: [CorreccionOcpComponent]
})
export class CorreccionOcpModule { }
