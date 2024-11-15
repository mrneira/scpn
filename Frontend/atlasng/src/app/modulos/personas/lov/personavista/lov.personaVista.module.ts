import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPersonaVistaRoutingModule } from './lov.personaVista.routing';
import { LovPersonaVistaComponent } from './componentes/lov.personaVista.component';

@NgModule({
  imports: [SharedModule, LovPersonaVistaRoutingModule],
  declarations: [LovPersonaVistaComponent],
  exports: [LovPersonaVistaComponent],
})
export class LovPersonaVistaModule { }

