import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCodigosConsultaRoutingModule } from './lov.codigosConsulta.routing';

import { LovCodigosConsultaComponent } from './componentes/lov.codigosConsulta.component';
import { CanalesModule } from '../../canales/canales.module';

@NgModule({
  imports: [SharedModule, LovCodigosConsultaRoutingModule, CanalesModule],
  declarations: [LovCodigosConsultaComponent],
  exports: [LovCodigosConsultaComponent]
})
export class LovCodigosConsultaModule { }
