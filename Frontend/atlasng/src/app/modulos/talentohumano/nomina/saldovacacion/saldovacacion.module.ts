import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SaldoVacacionRoutingModule } from './saldovacacion.routing';

import { SaldoVacacion } from './componentes/saldovacacion.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import {LovDescuentoModule} from '../../lov/descuento/lov.descuento.module';

import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, SaldoVacacionRoutingModule,LovFuncionariosModule,LovDescuentoModule,ParametroAnualModule,JasperModule ],
  declarations: [SaldoVacacion]
})
export class SaldoVacacionModule { }
