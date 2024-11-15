import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RelacionPersonaRoutingModule } from './relacionPersona.routing';

import { RelacionPersonaComponent } from './componentes/relacionPersona.component';


@NgModule({
  imports: [SharedModule, RelacionPersonaRoutingModule ],
  declarations: [RelacionPersonaComponent]
})
export class RelacionPersonaModule { }
