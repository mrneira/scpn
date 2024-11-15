import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ProvisionesIncobrablesRoutingModule } from './provisionesIncobrables.routing';
import { ProvisionesIncobrablesComponent } from './componentes/provisionesIncobrables.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, ProvisionesIncobrablesRoutingModule, JasperModule, TooltipModule ],
  declarations: [ProvisionesIncobrablesComponent]
})
export class ProvisionesIncobrablesModule { }
