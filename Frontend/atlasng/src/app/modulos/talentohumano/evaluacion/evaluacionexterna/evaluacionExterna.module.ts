import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionExternaRoutingModule } from './evaluacionExterna.routing';
import { EvaluacionExternaComponent } from './componentes/evaluacionExterna.component';
import{LovPeriodoModule} from '../../lov/periodo/lov.periodo.module';
import { LovDepartamentosModule } from '../../lov/departamentos/lov.departamentos.module';

@NgModule({
  imports: [SharedModule, EvaluacionExternaRoutingModule, LovPeriodoModule, LovDepartamentosModule],
  declarations: [EvaluacionExternaComponent]
})
export class EvaluacionExternaModule { }
