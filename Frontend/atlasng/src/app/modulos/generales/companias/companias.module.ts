import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CompaniasRoutingModule } from './companias.routing';

import { CompaniasComponent } from './componentes/companias.component';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';


@NgModule({
  imports: [SharedModule, CompaniasRoutingModule, LovPersonasModule ],
  declarations: [CompaniasComponent]
})
export class CompaniasModule { }
