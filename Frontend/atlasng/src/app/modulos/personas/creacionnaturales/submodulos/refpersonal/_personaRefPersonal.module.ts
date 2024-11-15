import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PersonaRefPersonalRoutingModule } from './_personaRefPersonal.routing';
import { PersonaRefPersonalComponent } from './componentes/_personaRefPersonal.component';
import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, PersonaRefPersonalRoutingModule, LovPersonasModule ],
  declarations: [PersonaRefPersonalComponent],
  exports: [PersonaRefPersonalComponent]
})
export class PersonaRefPersonalModule { }
