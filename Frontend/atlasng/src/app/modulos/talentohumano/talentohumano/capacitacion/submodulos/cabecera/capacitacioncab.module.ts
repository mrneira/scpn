import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CapacitacionEventoRoutingModule } from './capacitacioncab.routing';

import { CapacitacionEventoComponent } from './componentes/capacitacioncab.component';

import{LovEstablecimientoModule} from '../../../../lov/establecimiento/lov.establecimiento.module';


@NgModule({
  imports: [SharedModule, CapacitacionEventoRoutingModule, LovEstablecimientoModule],
  declarations: [CapacitacionEventoComponent],
  exports: [CapacitacionEventoComponent]
})
export class CapacitacionEventoModule { }
