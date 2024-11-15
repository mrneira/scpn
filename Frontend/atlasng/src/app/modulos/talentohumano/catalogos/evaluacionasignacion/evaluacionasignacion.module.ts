import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionasignacionRoutingModule } from './evaluacionasignacion.routing';

import { EvaluacionasignacionComponent } from './componentes/evaluacionasignacion.component';

import{LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import{LovPeriodoModule} from '../../lov/periodo/lov.periodo.module';
import{LovPlantillaModule} from '../../lov/plantilla/lov.plantillaevaluacionmrl.module';



@NgModule({
  imports: [SharedModule, EvaluacionasignacionRoutingModule, LovFuncionariosModule,LovPeriodoModule,LovPlantillaModule],
  declarations: [EvaluacionasignacionComponent]
})
export class EvaluacionasignacionModule { }
