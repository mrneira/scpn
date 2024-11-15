import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CapacitacionComponent } from './componentes/_capacitacion.component';
import {CapacitacionRoutingModule} from './../capacitacion/_capacitacion.routing';
import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import{LovEstablecimientoModule} from '../../../../lov/establecimiento/lov.establecimiento.module';
@NgModule({
  imports: [SharedModule ,CapacitacionRoutingModule,LovEstablecimientoModule,LovPaisesModule],
  declarations: [CapacitacionComponent],
  exports: [CapacitacionComponent]
})
export class CapacitacionModule { }
