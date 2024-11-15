import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BuzonIngPolizaRoutingModule } from './buzonIngPoliza.routing';

import { BuzonIngPolizaComponent } from './componentes/buzonIngPoliza.component';


@NgModule({
  imports: [SharedModule, BuzonIngPolizaRoutingModule ],
  declarations: [BuzonIngPolizaComponent]
})
export class BuzonIngPolizaModule { }
