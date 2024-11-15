import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoAnticipadoCajaRoutingModule } from './pagoAnticipadoCaja.routing';

import { PagoAnticipadoCajaComponent } from './componentes/pagoAnticipadoCaja.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, PagoAnticipadoCajaRoutingModule,LovPersonasModule,LovOperacionCarteraModule ],
  declarations: [PagoAnticipadoCajaComponent]
})
export class PagoAnticipadoCajaModule { }