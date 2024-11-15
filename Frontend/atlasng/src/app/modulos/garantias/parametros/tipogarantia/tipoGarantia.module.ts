import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoGarantiaRoutingModule } from './tipoGarantia.routing';

import { TipoGarantiaComponent } from './componentes/tipoGarantia.component';


@NgModule({
  imports: [SharedModule, TipoGarantiaRoutingModule ],
  declarations: [TipoGarantiaComponent]
})
export class TipoGarantiaModule { }
