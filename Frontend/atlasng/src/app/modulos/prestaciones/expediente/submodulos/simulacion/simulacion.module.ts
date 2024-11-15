import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { SimulacionRoutingModule } from './simulacion.routing';
import { SimulacionComponent } from './componentes/simulacion.component';


@NgModule({
  imports: [SharedModule, SimulacionRoutingModule],
  declarations: [SimulacionComponent],
  exports: [SimulacionComponent]
})
export class SimulacionModule { }