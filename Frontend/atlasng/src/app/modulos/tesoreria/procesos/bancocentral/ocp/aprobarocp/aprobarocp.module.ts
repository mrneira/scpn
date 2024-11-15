import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { AprobarOcpRoutingModule } from './aprobarocp.routing';
import { AprobarOcpComponent } from './componentes/aprobarocp.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AprobarOcpRoutingModule, JasperModule,TooltipModule],
  declarations: [AprobarOcpComponent]
})
export class AprobarOcpModule { }
