import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BuzonRenPolizaRoutingModule } from './buzonRenPoliza.routing';

import { BuzonRenPolizaComponent } from './componentes/buzonRenPoliza.component';


@NgModule({
  imports: [SharedModule, BuzonRenPolizaRoutingModule ],
  declarations: [BuzonRenPolizaComponent]
})
export class BuzonRenPolizaModule { }
