import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CapacitacionRoutingModule } from './capacitacion.routing';

import { CapacitacionComponent } from './componentes/capacitacion.component';

import{LovEstablecimientoModule} from '../../lov/establecimiento/lov.establecimiento.module';


@NgModule({
  imports: [SharedModule, CapacitacionRoutingModule, LovEstablecimientoModule],
  declarations: [CapacitacionComponent]
})
export class CapacitacionModule { }
