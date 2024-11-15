import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionmetaRoutingModule } from './evaluacionmeta.routing';

import { EvaluacionmetaComponent } from './componentes/evaluacionmeta.component';

import{LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import{LovPeriodoModule} from '../../lov/periodo/lov.periodo.module';
import { LovDepartamentosModule } from '../../lov/departamentos/lov.departamentos.module';
import { LovEvaluacionversionModule } from '../../lov/evaluacionversion/lov.evaluacionversion.module'



@NgModule({
  imports: [SharedModule, EvaluacionmetaRoutingModule, LovFuncionariosModule,LovPeriodoModule,LovDepartamentosModule,LovEvaluacionversionModule],
  declarations: [EvaluacionmetaComponent]
})
export class EvaluacionasignacionModule { }
