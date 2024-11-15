import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReportePagosRoutingModule } from './reportepagos.routing';
import { ReportePagosComponent } from './componentes/reportepagos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ReportePagosRoutingModule, JasperModule,TooltipModule],
  declarations: [ReportePagosComponent]
})
export class ReportPagosModule { }
