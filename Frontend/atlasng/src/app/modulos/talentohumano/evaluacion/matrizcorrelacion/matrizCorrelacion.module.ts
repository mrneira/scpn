import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MatrizCorrelacionRoutingModule } from './matrizCorrelacion.routing';

import { MatrizCorrelacionComponent } from './componentes/matrizCorrelacion.component';

import{LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import{LovPeriodoModule} from '../../lov/periodo/lov.periodo.module';
import { LovDepartamentosModule } from '../../lov/departamentos/lov.departamentos.module';
import { LovEvaluacionversionModule } from '../../lov/evaluacionversion/lov.evaluacionversion.module'
import { LovEvaluacionmetaModule } from '../../lov/evaluacionmeta/lov.evaluacionmeta.module'



@NgModule({
  imports: [SharedModule, MatrizCorrelacionRoutingModule, LovFuncionariosModule,LovPeriodoModule,LovDepartamentosModule,LovEvaluacionversionModule,LovEvaluacionmetaModule],
  declarations: [MatrizCorrelacionComponent]
})
export class MatrizCorrelacionModule { }
