import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JuntasaccionesRoutingModule } from './juntasacciones.routing';

import { JuntasaccionesComponent } from './componentes/juntasacciones.component';

@NgModule({
  imports: [SharedModule, JuntasaccionesRoutingModule],
  declarations: [JuntasaccionesComponent]
})
export class JuntasaccionesModule { }
