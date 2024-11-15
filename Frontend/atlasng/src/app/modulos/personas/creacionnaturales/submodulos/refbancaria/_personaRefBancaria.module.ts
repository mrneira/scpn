import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PersonaRefBancariaRoutingModule } from './_personaRefBancaria.routing';
import { PersonaRefBancariaComponent } from './componentes/_personaRefBancaria.component';

@NgModule({
  imports: [SharedModule, PersonaRefBancariaRoutingModule ],
  declarations: [PersonaRefBancariaComponent],
  exports: [PersonaRefBancariaComponent]
})
export class PersonaRefBancariaModule { }
