import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BalanceComprobacionReporteRoutingModule } from './balanceComprobacionReporte.routing';
import { BalanceComprobacionReporteComponent } from './componentes/balanceComprobacionReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';



@NgModule({
  imports: [SharedModule, BalanceComprobacionReporteRoutingModule, JasperModule ],
  declarations: [BalanceComprobacionReporteComponent]
})
export class BalanceComprobacionReporteModule { }
