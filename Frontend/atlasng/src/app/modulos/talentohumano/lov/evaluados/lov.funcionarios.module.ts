import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovFuncionariosEvaluadosRoutingModule } from './lov.funcionarios.routing';
import { LovFuncionariosEvaluadosComponent } from './componentes/lov.funcionarios.component';

@NgModule({
  imports: [SharedModule, LovFuncionariosEvaluadosRoutingModule],
  declarations: [LovFuncionariosEvaluadosComponent],
  exports: [LovFuncionariosEvaluadosComponent]
})
export class LovFuncionariosEvaluadosModule { }

