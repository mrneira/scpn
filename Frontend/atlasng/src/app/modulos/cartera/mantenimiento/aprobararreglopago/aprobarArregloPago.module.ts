import { NgModule } from '@angular/core';
import { SharedModule } from '../../.././../util/shared/shared.module';
import { AprobarArregloPagoRoutingModule } from './aprobarArregloPago.routing';
import { AprobarArregloPagoComponent } from './componentes/aprobarArregloPago.component';
import { OperacionArregloPagoComponent } from './componentes/operacionArregloPago.component';
import { RubrosArregloPagoComponent } from './componentes/rubrosArregloPago.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionArregloPagoModule } from '../../lov/arreglopago/lov.operacionArregloPago.module';

@NgModule({
  imports: [SharedModule, AprobarArregloPagoRoutingModule, LovPersonasModule, LovOperacionArregloPagoModule],
  declarations: [AprobarArregloPagoComponent, OperacionArregloPagoComponent, RubrosArregloPagoComponent],
  exports: [OperacionArregloPagoComponent, RubrosArregloPagoComponent]
})
export class AprobarArregloPagoModule { }
