import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { GarEstatusRoutingModule } from './garEstatus.routing';

import { EstatusComponent } from './componentes/estatus.component';


@NgModule({
  imports: [SharedModule, GarEstatusRoutingModule ],
  declarations: [EstatusComponent]
})
export class GarEstatusModule { }
