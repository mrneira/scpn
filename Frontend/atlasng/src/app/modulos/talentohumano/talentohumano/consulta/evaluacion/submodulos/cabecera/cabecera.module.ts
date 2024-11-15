import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { CabeceraRoutingModule } from './cabecera.routing';

import { CabeceraComponent } from './componentes/cabecera.component';

import { LovPeriodoModule } from '../../../../../lov/periodo/lov.periodo.module';
import {LovFuncionariosEvaluadosModule} from '../../../../../lov/evaluados/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, CabeceraRoutingModule,LovFuncionariosEvaluadosModule,LovPeriodoModule],
  declarations: [CabeceraComponent],
  exports: [CabeceraComponent]
})
export class CabeceraModule { }
