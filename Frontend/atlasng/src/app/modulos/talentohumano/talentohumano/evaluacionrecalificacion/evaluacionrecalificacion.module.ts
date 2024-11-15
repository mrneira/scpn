import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionRecalificacionRoutingModule } from './evaluacionrecalificacion.routing';
import { EvaluacionRecalificacionComponent } from './componentes/evaluacionrecalificacion.component'
import {LovFuncionariosEvaluadosModule} from '../../lov/evaluados/lov.funcionarios.module';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import { JasperModule } from '.././../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, EvaluacionRecalificacionRoutingModule,LovFuncionariosEvaluadosModule,JasperModule,SplitButtonModule],
  declarations: [EvaluacionRecalificacionComponent],
  exports: [EvaluacionRecalificacionComponent]
})
export class EvaluacionRecalificacionModule { }
