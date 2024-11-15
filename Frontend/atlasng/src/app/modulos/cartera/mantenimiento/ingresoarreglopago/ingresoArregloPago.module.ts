import { NgModule } from '@angular/core';
import { SharedModule } from '../../.././../util/shared/shared.module';
import { IngresoArregloPagoRoutingModule } from './ingresoArregloPago.routing';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { IngresoArregloPagoComponent } from './componentes/ingresoArregloPago.component';
import { CondicionesArregloPagoComponent } from './submodulos/condiciones/componentes/_condicionesArregloPago.component';
import { OperacionRubrosArregloPagoComponent } from './componentes/_operacionRubrosArregloPago.component';
import { RubrosArregloPagoComponent } from './componentes/_rubrosArregloPago.component';
import { CapacidadDeudorModule } from './submodulos/capacidaddeudor/_capacidadDeudor.module';
import { CapacidadGaranteModule } from './submodulos/capacidadgarante/_capacidadGarante.module';

@NgModule({
  imports: [SharedModule, IngresoArregloPagoRoutingModule, LovPersonasModule, LovPersonaVistaModule, LovOperacionCarteraModule,
    CapacidadDeudorModule, CapacidadGaranteModule],
  declarations: [IngresoArregloPagoComponent, CondicionesArregloPagoComponent, OperacionRubrosArregloPagoComponent,
    RubrosArregloPagoComponent],
  exports: [OperacionRubrosArregloPagoComponent, RubrosArregloPagoComponent]
})
export class IngresoArregloPagoModule { }
