import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperativoContableTesoreriaRoutingModule } from './operativocontabletesoreria.routing';
import { OperativoContableTesoreriaComponent } from './componentes/operativocontabletesoreria.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, OperativoContableTesoreriaRoutingModule, JasperModule,TooltipModule],
  declarations: [OperativoContableTesoreriaComponent]
})
export class OperativoContableTesoreriaModule { }
