import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PlanCuentasComponent } from './componentes/planCuentas.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { PlanCuentasRoutingModule } from './planCuentas.routing';


@NgModule({
  imports: [SharedModule, PlanCuentasRoutingModule, JasperModule, SpinnerModule ],
  declarations: [PlanCuentasComponent]
})
export class PlanCuentasModule { }
