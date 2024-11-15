import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoSeguroRoutingModule } from './tipoSeguro.routing';

import { TipoSeguroComponent } from './componentes/tipoSeguro.component';
import { LovSaldoModule } from '../../../monetario/lov/saldo/lov.saldo.module';


@NgModule({
  imports: [SharedModule, TipoSeguroRoutingModule, LovSaldoModule],
  declarations: [TipoSeguroComponent]
})
export class TipoSeguroModule { }
