import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CalificacionRoutingModule } from './calificacion.routing';

import { CalificacionComponent } from './componentes/calificacion.component';


@NgModule({
  imports: [SharedModule, CalificacionRoutingModule ],
  declarations: [CalificacionComponent]
})
export class CalificacionModule { }
