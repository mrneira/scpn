import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ReprocesarArchivOcpRoutingModule } from './reprocesararchivocp.routing';
import { ReprocesarArchivOcpComponent } from './componentes/reprocesararchivocp.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ReprocesarArchivOcpRoutingModule, JasperModule,TooltipModule],
  declarations: [ReprocesarArchivOcpComponent]
})
export class ReprocesarArchivOcpModule { }
