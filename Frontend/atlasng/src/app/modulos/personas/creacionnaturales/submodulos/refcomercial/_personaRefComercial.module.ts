import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PersonaRefComercialRoutingModule } from './_personaRefComercial.routing';
import { PersonaRefComercialComponent } from './componentes/_personaRefComercial.component';

@NgModule({
  imports: [SharedModule, PersonaRefComercialRoutingModule ],
  declarations: [PersonaRefComercialComponent],
  exports: [PersonaRefComercialComponent]
})
export class PersonaRefComercialModule { }
