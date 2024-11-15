import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { AutorizarModificacionSpiRoutingModule } from './autorizarmodificacionspi.routing';
import { AutorizarModificacionSpiComponent } from './componentes/autorizarmodificacionspi.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AutorizarModificacionSpiRoutingModule, JasperModule,TooltipModule],
  declarations: [AutorizarModificacionSpiComponent]
})
export class AutorizarModificacionSpiModule { }
