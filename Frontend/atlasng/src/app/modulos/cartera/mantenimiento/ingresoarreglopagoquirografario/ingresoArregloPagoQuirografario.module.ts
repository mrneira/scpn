import { NgModule } from '@angular/core';
import { SharedModule } from '../../.././../util/shared/shared.module';
import { IngresoArregloPagoQuirografarioRoutingModule } from './ingresoArregloPagoQuirografario.routing';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { IngresoArregloPagoQuirografarioComponent } from './componentes/ingresoArregloPagoQuirografario.component';
import { CondicionesArregloPagoQuirografarioComponent } from './submodulos/condiciones/componentes/_condicionesArregloPagoQuirografario.component';
import { OperacionRubrosArregloPagoQuirografarioComponent } from './componentes/_operacionRubrosArregloPagoQuirografario.component';
import { RubrosArregloPagoQuirografarioComponent } from './componentes/_rubrosArregloPagoQuirografario.component';
import { CapacidadDeudorModule } from './submodulos/capacidaddeudor/_capacidadDeudor.module';
import { CapacidadGaranteModule } from './submodulos/capacidadgarante/_capacidadGarante.module';

@NgModule({
  imports: [SharedModule, IngresoArregloPagoQuirografarioRoutingModule, LovPersonasModule, LovPersonaVistaModule, LovOperacionCarteraModule,
    CapacidadDeudorModule, CapacidadGaranteModule],
  declarations: [IngresoArregloPagoQuirografarioComponent, CondicionesArregloPagoQuirografarioComponent, OperacionRubrosArregloPagoQuirografarioComponent,
    RubrosArregloPagoQuirografarioComponent],
  exports: [OperacionRubrosArregloPagoQuirografarioComponent, RubrosArregloPagoQuirografarioComponent]
})
export class IngresoArregloPagoQuirografarioModule { }
