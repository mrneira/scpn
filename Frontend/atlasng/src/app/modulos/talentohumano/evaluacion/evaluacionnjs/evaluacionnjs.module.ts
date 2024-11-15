import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionRoutingModule } from './evaluacionnjs.routing';
import { EvaluacionComponent } from './componentes/evaluacion.component';

//Submodulos
import { NjsDetalleModule } from './submodulos/njs/njs.module';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';


//lov

import { LovFuncionariosEvaluadosModule} from '../../lov/evaluadosnjs/lov.funcionarios.module'

@NgModule({
  imports: [SharedModule, EvaluacionRoutingModule,
    NjsDetalleModule,CabeceraModule,LovFuncionariosEvaluadosModule],
  declarations: [EvaluacionComponent]
})
export class EvaluacionNjsModule { }
