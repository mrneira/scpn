import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BuzonIncrPolizaRoutingModule } from './buzonIncrPoliza.routing';

import { BuzonIncrPolizaComponent } from './componentes/buzonIncrPoliza.component';


@NgModule({
  imports: [SharedModule, BuzonIncrPolizaRoutingModule ],
  declarations: [BuzonIncrPolizaComponent]
})
export class BuzonIncrPolizaModule { }
