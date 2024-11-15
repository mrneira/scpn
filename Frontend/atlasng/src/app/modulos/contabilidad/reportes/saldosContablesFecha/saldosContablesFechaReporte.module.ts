import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SaldosContablesFechaReporteRoutingModule } from './saldosContablesFechaReporte.routing';

import { SaldosContablesFechaReporteComponent } from './componentes/saldosContablesFechaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, SaldosContablesFechaReporteRoutingModule, JasperModule, LovCuentasContablesModule ],
  declarations: [SaldosContablesFechaReporteComponent]
})
export class SaldosContablesFechaReporteModule { }
