import { NgModule } from '@angular/core';
import { SharedModule } from '../.././../util/shared/shared.module';
import { IngresoGastosRoutingModule } from './ingresoGastos.routing';

import { IngresoGastosComponent } from './componentes/ingresoGastos.component';
import { TablaAmortizacionComponent } from './componentes/_tablaAmortizacion.component';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovOperacionCobranzaModule } from '../lov/operacion/lov.operacionCobranza.module';
import { LovSaldoModule } from '../../monetario/lov/saldo/lov.saldo.module';

@NgModule({
  imports: [SharedModule, IngresoGastosRoutingModule, LovPersonasModule, LovOperacionCobranzaModule, LovSaldoModule],
  declarations: [IngresoGastosComponent, TablaAmortizacionComponent]
})
export class IngresoGastosModule { }
