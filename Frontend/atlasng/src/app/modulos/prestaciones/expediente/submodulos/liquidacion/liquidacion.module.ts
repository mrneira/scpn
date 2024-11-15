import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { LiquidacionRoutingModule } from './liquidacion.routing';
import { LovEtapaExpedienteModule } from '../../../lov/etapaexpediente/lov.etapaexpediente.module';

import { LiquidacionComponent } from './componentes/liquidacion.component';

@NgModule({
  imports: [SharedModule, LiquidacionRoutingModule, LovEtapaExpedienteModule],
  declarations: [LiquidacionComponent],
  exports: [LiquidacionComponent]
})
export class LiquidacionModule { }