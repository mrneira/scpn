import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { GenerarOcpRoutingModule } from './generarocp.routing';
import { GenerarOcpComponent } from './componentes/generarocp.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, GenerarOcpRoutingModule, JasperModule,TooltipModule],
  declarations: [GenerarOcpComponent]
})
export class GenerarOcpModule { }
