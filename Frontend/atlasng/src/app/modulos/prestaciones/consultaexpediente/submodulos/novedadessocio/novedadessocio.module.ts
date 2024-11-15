import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { NovedadessocioRoutingModule } from './novedadessocio.routing';

import { NovedadessocioComponent } from './componentes/novedadessocio.component';

import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, NovedadessocioRoutingModule, LovPersonasModule ],
  declarations: [NovedadessocioComponent],
  exports: [NovedadessocioComponent]
})
export class NovedadessocioModule { }
