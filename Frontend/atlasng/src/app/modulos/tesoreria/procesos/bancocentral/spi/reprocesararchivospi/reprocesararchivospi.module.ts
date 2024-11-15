import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ReprocesarArchivoSpiRoutingModule } from './reprocesararchivospi.routing';
import { ReprocesarArchivoSpiComponent } from './componentes/reprocesararchivospi.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ReprocesarArchivoSpiRoutingModule, JasperModule,TooltipModule],
  declarations: [ReprocesarArchivoSpiComponent]
})
export class ReprocesarArchivoSpiModule { }
