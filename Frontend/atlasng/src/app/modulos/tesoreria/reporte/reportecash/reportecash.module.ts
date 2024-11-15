import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReporteCashRoutingModule } from './reportecash.routing';
import { ReporteCashComponent } from './componentes/reportecash.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ReporteCashRoutingModule, JasperModule,TooltipModule],
  declarations: [ReporteCashComponent]
})
export class ReporteCashModule { }
