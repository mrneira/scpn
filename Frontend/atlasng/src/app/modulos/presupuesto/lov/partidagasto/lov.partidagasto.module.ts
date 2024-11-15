import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPartidaGastoRoutingModule } from './lov.partidagasto.routing';

import { LovPartidaGastoComponent } from './componentes/lov.partidagasto.component';


@NgModule({
  imports: [SharedModule, LovPartidaGastoRoutingModule],
  declarations: [LovPartidaGastoComponent],
  exports: [LovPartidaGastoComponent]
})
export class LovPartidaGastoModule { }

