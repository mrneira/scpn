import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CuentasPorCobrarRoutingModule } from './cuentasPorCobrar.routing';
import { LovSaldoModule } from '../../../monetario/lov/saldo/lov.saldo.module';
import { CuentasPorCobrarComponent } from './componentes/cuentasPorCobrar.component';


@NgModule({
  imports: [SharedModule, CuentasPorCobrarRoutingModule, LovSaldoModule ],
  declarations: [CuentasPorCobrarComponent]
})
export class CuentasPorCobrarModule { }
