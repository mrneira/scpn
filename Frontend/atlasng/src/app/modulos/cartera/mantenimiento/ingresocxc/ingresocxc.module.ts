import { NgModule } from '@angular/core';
import { SharedModule } from '../../.././../util/shared/shared.module';
import { IngresocxcRoutingModule } from './ingresocxc.routing';
import { IngresocxcComponent } from './componentes/ingresocxc.component';
import { TablaAmortizacionModule } from '../../consultas/consultaoperacion/submodulos/tablaamortizacion/_tablaAmortizacion.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { LovSaldoModule } from '../../../monetario/lov/saldo/lov.saldo.module';

@NgModule({
  imports: [SharedModule, IngresocxcRoutingModule, LovPersonasModule, LovOperacionCarteraModule, LovSaldoModule, TablaAmortizacionModule],
  declarations: [IngresocxcComponent]
})
export class IngresocxcModule { }
