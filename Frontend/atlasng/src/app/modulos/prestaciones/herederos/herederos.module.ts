import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { HerederosRoutingModule } from './herederos.routing';

import { HerederosComponent } from './componentes/herederos.component';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, HerederosRoutingModule, LovPersonasModule ],
  declarations: [HerederosComponent],
  exports: [HerederosComponent]
})
export class HerederosModule { }
