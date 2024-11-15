import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { IngresosCapacidadRoutingModule } from './_ingresosCapacidad.routing';
import { IngresosCapacidadComponent } from './componentes/_ingresosCapacidad.component';

@NgModule({
  imports: [SharedModule, IngresosCapacidadRoutingModule],
  declarations: [IngresosCapacidadComponent],
  exports: [IngresosCapacidadComponent]
})
export class IngresosCapacidadModule { }
