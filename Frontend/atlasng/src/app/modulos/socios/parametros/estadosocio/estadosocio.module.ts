import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoSocioRoutingModule } from './estadosocio.routing';

import { EstadoSocioComponent } from './componentes/estadosocio.component';


@NgModule({
  imports: [SharedModule, EstadoSocioRoutingModule ],
  declarations: [EstadoSocioComponent]
})
export class EstadoSocioModule { }
