import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionAsignacionnjsRoutingModule } from './evaluacionAsignacionnjs.routing';

import { EvaluacionAsignacionnjsComponent } from './componentes/evaluacionAsignacionnjs.component';

import{LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import{LovPeriodoModule} from '../../lov/periodo/lov.periodo.module';
import{LovPlantillaModule} from '../../lov/plantilla/lov.plantillaevaluacionmrl.module';



@NgModule({
  imports: [SharedModule, EvaluacionAsignacionnjsRoutingModule, LovFuncionariosModule,LovPeriodoModule,LovPlantillaModule],
  declarations: [EvaluacionAsignacionnjsComponent]
})
export class EvaluacionAsignacionnjsModule { }
