import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CalificacionCualitativaRoutingModule } from './calificacioncualitativa.routing';

import { CalificacionCualitativaComponent } from './componentes/calificacioncualitativa.component';


@NgModule({
  imports: [SharedModule, CalificacionCualitativaRoutingModule ],
  declarations: [CalificacionCualitativaComponent]
})
export class CalificacionCualitativaModule { }
