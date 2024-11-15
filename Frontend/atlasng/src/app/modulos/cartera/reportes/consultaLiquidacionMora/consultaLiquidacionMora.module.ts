import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaLiquidacionMoraRoutingModule } from './consultaLiquidacionMora.routing';

import { ConsultaLiquidacionMoraComponent } from './componentes/consultaLiquidacionMora.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ConsultaLiquidacionMoraRoutingModule, JasperModule],
  declarations: [ConsultaLiquidacionMoraComponent]
})
export class ConsultaLiquidacionMoraModule { }
