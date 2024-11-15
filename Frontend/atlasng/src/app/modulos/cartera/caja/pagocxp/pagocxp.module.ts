import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagocxpRoutingModule } from './pagocxp.routing';

import { PagocxpComponent } from './componentes/pagocxp.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';



@NgModule({
  imports: [SharedModule, PagocxpRoutingModule, LovPersonasModule, LovOperacionCarteraModule ],
  declarations: [PagocxpComponent]
})
export class PagocxpModule { }
