import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionmatrizcorrelacionRoutingModule } from './evaluacionmatrizcorrelacion.routing';
import { EvaluacionMatrizCorrelacionComponent } from './componentes/evaluacionmatrizcorrelacion.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import { LovEvaluacionmetaModule } from '../../lov/evaluacionmeta/lov.evaluacionmeta.module'
import { LovMatrizCorrelacionModule } from '../../lov/matrizcorrelacion/lov.matrizcorrelacion.module'

@NgModule({
  imports: [SharedModule, EvaluacionmatrizcorrelacionRoutingModule, LovMatrizCorrelacionModule, JasperModule, LovEvaluacionmetaModule,LovFuncionariosModule,SpinnerModule],
  declarations: [EvaluacionMatrizCorrelacionComponent]
})
export class EvaluacionmatrizcorrelacionModule { }
