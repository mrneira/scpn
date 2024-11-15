import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { SaldoRoutingModule } from './saldo.routing';

import { SaldoComponent } from './componentes/saldo.component';

import { TipoSaldoModule } from '../tiposaldo/tipoSaldo.module';
import { ModulosModule } from '../../generales/modulos/modulos.module';

@NgModule({
  imports: [SharedModule, SaldoRoutingModule, TipoSaldoModule, ModulosModule],
  declarations: [SaldoComponent]
})
export class SaldoModule { }
