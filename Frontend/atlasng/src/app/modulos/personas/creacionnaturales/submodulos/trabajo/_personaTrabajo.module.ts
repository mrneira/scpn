import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PersonaTrabajoRoutingModule } from './_personaTrabajo.routing';
import { PersonaTrabajoComponent } from './componentes/_personaTrabajo.component';

@NgModule({
  imports: [SharedModule, PersonaTrabajoRoutingModule ],
  declarations: [PersonaTrabajoComponent],
  exports: [PersonaTrabajoComponent]
})
export class PersonaTrabajoModule { }
