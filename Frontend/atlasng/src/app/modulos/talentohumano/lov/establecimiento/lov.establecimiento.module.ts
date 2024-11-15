import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {LovEstablecimientoRoutingModule } from './lov.establecimiento.routing';

import { LovEstablecimientoComponent } from './componentes/lov.establecimiento.component';

@NgModule({
  imports: [SharedModule, LovEstablecimientoRoutingModule],
  declarations: [LovEstablecimientoComponent],
  exports: [LovEstablecimientoComponent],
})
export class LovEstablecimientoModule { }

