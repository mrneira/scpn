import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoRespuestaBceRoutingModule } from './estadorespuestabce.routing';

import { EstadoRespuestaBceComponent } from './componentes/estadorespuestabce.component';


@NgModule({
  imports: [SharedModule,EstadoRespuestaBceRoutingModule ],
  declarations: [EstadoRespuestaBceComponent]
})
export class EstadoRespuestaBceModule { }
