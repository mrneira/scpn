import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AprobacionEvaluacionRoutingModule } from './evaluacionaprob.routing';
import { AprobacionEvaluacionComponent } from './componentes/evaluacionaprob.component'
import {LovFuncionariosEvaluadosModule} from '../../lov/evaluados/lov.funcionarios.module';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import { JasperModule } from '.././../../../util/componentes/jasper/jasper.module';

import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';
@NgModule({
  imports: [SharedModule, AprobacionEvaluacionRoutingModule,LovFuncionariosEvaluadosModule,JasperModule,SplitButtonModule,GestorDocumentalModule],
  declarations: [AprobacionEvaluacionComponent],
  exports: [AprobacionEvaluacionComponent]
})
export class NotificacionEvaluacionModule { }
