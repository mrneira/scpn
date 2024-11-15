import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TipoSaldoRoutingModule } from './tipoSaldo.routing';

import { TipoSaldoComponent } from './componentes/tipoSaldo.component';


@NgModule({
  imports: [SharedModule, TipoSaldoRoutingModule ],
  declarations: [TipoSaldoComponent]
})
export class TipoSaldoModule { }
