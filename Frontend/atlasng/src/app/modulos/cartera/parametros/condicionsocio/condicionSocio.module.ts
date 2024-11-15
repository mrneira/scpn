import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CondicionSocioRoutingModule } from './condicionSocio.routing';

import { CondicionSocioComponent } from './componentes/condicionSocio.component';


@NgModule({
  imports: [SharedModule, CondicionSocioRoutingModule],
  declarations: [CondicionSocioComponent]
})
export class CondicionSocioModule { }
