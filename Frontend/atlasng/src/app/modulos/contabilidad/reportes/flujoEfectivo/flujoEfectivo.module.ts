import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { FlujoEfectivoRoutingModule } from './flujoEfectivo.routing';

import { FlujoEfectivoComponent } from './componentes/flujoEfectivo.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, FlujoEfectivoRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [FlujoEfectivoComponent]
})
export class FlujoEfectivoModule { }
