import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BuzonGenPolizaRoutingModule } from './buzonGenPoliza.routing';

import { BuzonGenPolizaComponent } from './componentes/buzonGenPoliza.component';


@NgModule({
  imports: [SharedModule, BuzonGenPolizaRoutingModule ],
  declarations: [BuzonGenPolizaComponent]
})
export class BuzonGenPolizaModule { }
