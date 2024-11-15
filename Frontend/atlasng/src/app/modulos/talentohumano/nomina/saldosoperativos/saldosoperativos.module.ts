import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SaldosOperativoRoutingModule } from './saldosoperativos.routing';

import { SaldosOperativoComponent } from './componentes/saldosoperativos.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import {LovBeneficioModule } from '../../lov/beneficio/lov.beneficio.module';


import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, SaldosOperativoRoutingModule,LovFuncionariosModule,LovBeneficioModule,ParametroAnualModule ],
  declarations: [SaldosOperativoComponent]
})
export class SaldosOperativoModule { }
