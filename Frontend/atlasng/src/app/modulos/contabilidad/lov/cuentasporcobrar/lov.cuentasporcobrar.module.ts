import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCuentasPorCobrarRoutingModule } from './lov.cuentasporcobrar.routing';
import { LovCuentasPorCobrarComponent } from './componentes/lov.cuentasporcobrarcomponent';

import { LovClientesModule } from '../../lov/clientes/lov.clientes.module';

@NgModule({
  imports: [SharedModule, LovCuentasPorCobrarRoutingModule, LovClientesModule],
  declarations: [LovCuentasPorCobrarComponent],
  exports: [LovCuentasPorCobrarComponent],
})
export class LovCuentasPorCobrarModule { }