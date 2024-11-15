import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { RubroTransaccionRoutingModule } from './rubroTransaccion.routing';
import { RubroTransaccionComponent } from './componentes/rubroTransaccion.component';

import { LovTransaccionesModule } from '../../generales/lov/transacciones/lov.transacciones.module';
import { LovSaldoModule } from '../lov/saldo/lov.saldo.module';


@NgModule({
  imports: [SharedModule, RubroTransaccionRoutingModule, LovTransaccionesModule, LovSaldoModule ],
  declarations: [RubroTransaccionComponent]
})
export class RubroTransaccionModule { }
