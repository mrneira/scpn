import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { EstadopatrimonioRoutingModule } from './estadopatrimonio.routing';

import { EstadopatrimonioComponent } from './componentes/estadopatrimonio.component';


@NgModule({
  imports: [SharedModule, EstadopatrimonioRoutingModule ],
  declarations: [EstadopatrimonioComponent]
})
export class EstadopatrimonioModule { }
