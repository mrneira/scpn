import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CalificacionRangosRoutingModule } from './calificacionRangos.routing';

import { CalificacionRangosComponent } from './componentes/calificacionRangos.component';


@NgModule({
  imports: [SharedModule, CalificacionRangosRoutingModule ],
  declarations: [CalificacionRangosComponent]
})
export class CalificacionRangosModule { }
