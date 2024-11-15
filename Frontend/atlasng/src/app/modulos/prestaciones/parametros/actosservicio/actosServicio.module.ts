import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ActosServicioRoutingModule } from './actosServicio.routing';

import { ActosServicioComponent } from './componentes/actosServicio.component';
import {LovTipoBajaModule} from '../../../socios/lov/tipobaja/lov.tipoBaja.module';


@NgModule({
  imports: [SharedModule, ActosServicioRoutingModule , LovTipoBajaModule ],
  declarations: [ActosServicioComponent]
})
export class ActosServicioModule { }
