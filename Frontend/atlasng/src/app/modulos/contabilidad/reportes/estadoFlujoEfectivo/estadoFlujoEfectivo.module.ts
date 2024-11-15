import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoFlujoEfectivoRoutingModule } from './estadoFlujoEfectivo.routing';

import { EstadoFlujoEfectivoComponent } from './componentes/estadoFlujoEfectivo.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, EstadoFlujoEfectivoRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [EstadoFlujoEfectivoComponent]
})
export class EstadoFlujoEfectivoModule { }
