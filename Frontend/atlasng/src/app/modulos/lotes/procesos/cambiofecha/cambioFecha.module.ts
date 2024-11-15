import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CambioFechaRoutingModule } from './cambioFecha.routing';

import { CambioFechaComponent } from './componentes/cambioFecha.component';


@NgModule({
  imports: [SharedModule, CambioFechaRoutingModule ],
  declarations: [CambioFechaComponent]
})
export class CambioFechaModule { }
