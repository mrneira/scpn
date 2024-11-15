import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovAportesRoutingModule } from './lov.aportes.routing';

import { LovAportesComponent } from './componentes/lov.aportes.component';

import { LovPersonasPrestacionesModule } from './../../../personas/lov/personasprestaciones/lov.personas.module'

@NgModule({
  imports: [SharedModule, LovAportesRoutingModule,LovPersonasPrestacionesModule],
  declarations: [LovAportesComponent],
  exports: [LovAportesComponent]
})
export class LovAportesModule { }

