import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReportesExtracontablesRoutingModule } from './reportesExtracontables.routing';
import { ReportesExtracontablesComponent } from './componentes/reportesExtracontables.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ReportesExtracontablesRoutingModule, JasperModule ],
  declarations: [ReportesExtracontablesComponent]
})
export class ReportesExtracontablesModule { }
