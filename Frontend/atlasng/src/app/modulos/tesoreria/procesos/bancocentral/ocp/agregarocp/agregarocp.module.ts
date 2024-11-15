import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { AgregarOcpRoutingModule } from './agregarocp.routing';
import { AgregarOcpComponent } from './componentes/agregarocp.component';
import { JasperModule } from '../../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';
import { LovEstadoTransaccionModule } from "../../../../lov/estadotransaccion/lov.estadotransaccion.module";

@NgModule({
  imports: [SharedModule, AgregarOcpRoutingModule, JasperModule,TooltipModule, LovEstadoTransaccionModule],
  declarations: [AgregarOcpComponent]
})
export class AgregarOcpModule { }
