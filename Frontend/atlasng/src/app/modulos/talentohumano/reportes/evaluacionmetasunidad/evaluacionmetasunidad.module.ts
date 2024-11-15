import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionmetasunidadRoutingModule } from './evaluacionmetasunidad.routing';
import { EvaluacionMetasUnidadComponent } from './componentes/evaluacionmetasunidad.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';
import { LovEvaluacionmetaModule } from '../../lov/evaluacionmeta/lov.evaluacionmeta.module'

@NgModule({
  imports: [SharedModule, EvaluacionmetasunidadRoutingModule, JasperModule, LovEvaluacionmetaModule,LovFuncionariosModule,SpinnerModule],
  declarations: [EvaluacionMetasUnidadComponent]
})
export class EvaluacionmetasunidadModule { }
