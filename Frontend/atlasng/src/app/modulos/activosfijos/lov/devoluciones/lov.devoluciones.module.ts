import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovDevolucionesRoutingModule } from './lov.devoluciones.routing';

import { LovDevolucionesComponent } from './componentes/lov.devoluciones.component';


@NgModule({
  imports: [SharedModule, LovDevolucionesRoutingModule],
  declarations: [LovDevolucionesComponent],
  exports: [LovDevolucionesComponent]
})
export class LovDevolucionesModule { }

