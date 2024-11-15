import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MovimientosflujocajaRoutingModule } from './movimientosflujocaja.routing';

import { MovimientosflujocajaComponent } from './componentes/movimientosflujocaja.component';


@NgModule({
  imports: [SharedModule,MovimientosflujocajaRoutingModule ],
  declarations: [MovimientosflujocajaComponent]
})
export class MovimientosflujocajaModule { }
