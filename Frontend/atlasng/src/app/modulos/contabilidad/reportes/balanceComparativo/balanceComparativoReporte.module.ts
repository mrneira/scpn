import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BalanceComparativoReporteRoutingModule } from './balanceComparativoReporte.routing';

import { BalanceComparativoReporteComponent } from './componentes/balanceComparativoReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, BalanceComparativoReporteRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [BalanceComparativoReporteComponent]
})
export class BalanceComparativoReporteModule { }
