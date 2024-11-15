import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { ResultadoEvaluacionRoutingModule } from './resultadoevaluacion.routing';

import { ResultadoEvaluacionComponent } from './componentes/resultadoevaluacion.component';

import{LovFuncionariosModule} from '../../../lov/funcionarios/lov.funcionarios.module';
import{LovPeriodoModule} from '../../../lov/periodo/lov.periodo.module';
import{LovPlantillaModule} from '../../../lov/plantilla/lov.plantillaevaluacionmrl.module';

import { JasperModule } from '../.././../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, ResultadoEvaluacionRoutingModule, LovFuncionariosModule,LovPeriodoModule,LovPlantillaModule,JasperModule],
  declarations: [ResultadoEvaluacionComponent]
})
export class ResultadoevaluacionModule { }
