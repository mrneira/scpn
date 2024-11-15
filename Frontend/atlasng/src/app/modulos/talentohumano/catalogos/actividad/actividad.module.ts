import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ActividadRoutingModule } from './actividad.routing';

import { ActividadComponent } from './componentes/actividad.component';


@NgModule({
  imports: [SharedModule, ActividadRoutingModule ],
  declarations: [ActividadComponent]
})
export class ActividadModule { }
