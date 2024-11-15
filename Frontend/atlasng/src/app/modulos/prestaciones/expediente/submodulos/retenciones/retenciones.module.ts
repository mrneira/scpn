import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { RetencionesRoutingModule } from './retenciones.routing';

import { RetencionesComponent } from './componentes/retenciones.component';

import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';


@NgModule({
  imports: [SharedModule, RetencionesRoutingModule, LovPersonasModule ],
  declarations: [RetencionesComponent],
  exports: [RetencionesComponent]
})
export class RetencionesModule { }