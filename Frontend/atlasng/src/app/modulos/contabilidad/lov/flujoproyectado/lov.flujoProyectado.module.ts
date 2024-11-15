import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovFlujoProyectadoRoutingModule } from './lov.flujoProyectado.routing';

import { LovFlujoProyectadoComponent } from './componentes/lov.flujoProyectado.component';


@NgModule({
  imports: [SharedModule, LovFlujoProyectadoRoutingModule],
  declarations: [LovFlujoProyectadoComponent],
  exports: [LovFlujoProyectadoComponent]
})
export class LovFlujoProyectadoModule { }

