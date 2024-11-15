import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultadefaultRoutingModule } from './consultadefault.routing';
import { ConsultadefaultComponent } from './componentes/consultadefault.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovDefaultModule } from '../../lov/default/lov.default.module';
import { TooltipModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, ConsultadefaultRoutingModule, JasperModule, TooltipModule, LovDefaultModule ],
  declarations: [ConsultadefaultComponent]
})
export class ConsultadefaultModule { }
