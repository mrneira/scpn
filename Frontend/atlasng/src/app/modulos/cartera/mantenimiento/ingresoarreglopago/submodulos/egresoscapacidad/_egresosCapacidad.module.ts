import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { EgresosCapacidadRoutingModule } from './_egresosCapacidad.routing';
import { EgresosCapacidadComponent } from './componentes/_egresosCapacidad.component';

@NgModule({
  imports: [SharedModule, EgresosCapacidadRoutingModule ],
  declarations: [EgresosCapacidadComponent],
  exports: [EgresosCapacidadComponent]
})
export class EgresosCapacidadModule { }
