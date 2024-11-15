import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPartidaIngresoRoutingModule } from './lov.partidaingreso.routing';

import { LovPartidaIngresoComponent } from './componentes/lov.partidaingreso.component';


@NgModule({
  imports: [SharedModule, LovPartidaIngresoRoutingModule],
  declarations: [LovPartidaIngresoComponent],
  exports: [LovPartidaIngresoComponent]
})
export class LovPartidaIngresoModule { }

