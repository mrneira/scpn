import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BandejaRoutingModule } from './bandeja.routing';
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';

import { BandejaComponent } from './componentes/bandeja.component';


@NgModule({
  imports: [SharedModule, BandejaRoutingModule, LovPersonasModule ],
  declarations: [BandejaComponent]
})
export class BandejaModule { }
