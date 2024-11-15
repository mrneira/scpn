import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovFuncionariosEvaluadosComponent } from './componentes/lov.funcionarios.component';

const routes: Routes = [
  {
    path: '', component: LovFuncionariosEvaluadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovFuncionariosEvaluadosRoutingModule {}
