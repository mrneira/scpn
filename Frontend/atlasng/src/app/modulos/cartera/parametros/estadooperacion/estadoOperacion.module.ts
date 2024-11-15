import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoOperacionRoutingModule } from './estadoOperacion.routing';

import { EstadoOperacionComponent } from './componentes/estadoOperacion.component';


@NgModule({
  imports: [SharedModule, EstadoOperacionRoutingModule ],
  declarations: [EstadoOperacionComponent]
})
export class EstadoOperacionModule { }
