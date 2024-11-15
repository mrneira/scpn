import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BalanceGeneralReporteRoutingModule } from './balanceGeneralReporte.routing';
import { BalanceGeneralReporteComponent } from './componentes/balanceGeneralReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';



@NgModule({
  imports: [SharedModule, BalanceGeneralReporteRoutingModule, JasperModule ],
  declarations: [BalanceGeneralReporteComponent]
})
export class BalanceGeneralReporteModule { }
