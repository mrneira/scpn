import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoSaldoRoutingModule } from './pagosaldo.routing';

import { PagoSaldoComponent } from './componentes/pagosaldo.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';


import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';
@NgModule({
  imports: [SharedModule, PagoSaldoRoutingModule,LovFuncionariosModule ,ParametroAnualModule],
  declarations: [PagoSaldoComponent]
})
export class PagoSaldoModule { }
