import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { AutorizarAplicacionRoutingModule } from './autorizaraplicacion.routing';
import { AutorizarAplicacionComponent } from './componentes/autorizaraplicacion.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AutorizarAplicacionRoutingModule, JasperModule,TooltipModule],
  declarations: [AutorizarAplicacionComponent]
})
export class AutorizarAplicacionModule { }
