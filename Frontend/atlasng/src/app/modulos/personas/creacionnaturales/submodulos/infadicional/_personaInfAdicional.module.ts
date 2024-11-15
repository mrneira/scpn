import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PersonaInfAdicionalRoutingModule } from './_personaInfAdicional.routing';
import { PersonaInfAdicionalComponent } from './componentes/_personaInfAdicional.component';

@NgModule({
  imports: [SharedModule, PersonaInfAdicionalRoutingModule ],
  declarations: [PersonaInfAdicionalComponent],
  exports: [PersonaInfAdicionalComponent]
})
export class PersonaInfAdicionalModule { }
