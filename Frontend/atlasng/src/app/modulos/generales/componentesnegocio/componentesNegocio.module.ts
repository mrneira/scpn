import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ComponentesNegocioRoutingModule } from './componentesNegocio.routing';

import { ComponentesNegocioComponent } from './componentes/componentesNegocio.component';


@NgModule({
  imports: [SharedModule, ComponentesNegocioRoutingModule ],
  declarations: [ComponentesNegocioComponent]
})
export class ComponentesNegocioModule { }
