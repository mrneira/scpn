import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovComponentesNegocioRoutingModule } from './lov.componentesNegocio.routing';

import { LovComponentesNegocioComponent } from './componentes/lov.componentesNegocio.component';
import { CanalesModule } from '../../canales/canales.module';

@NgModule({
  imports: [SharedModule, LovComponentesNegocioRoutingModule, CanalesModule],
  declarations: [LovComponentesNegocioComponent],
  exports: [LovComponentesNegocioComponent]
})
export class LovComponentesNegocioModule { }
