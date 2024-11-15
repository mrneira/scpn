import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovFuncionariosMutableComponent } from './componentes/lov.funcionariosmutable.component';

const routes: Routes = [
  {
    path: '', component: LovFuncionariosMutableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovFuncionariosMutableRoutingModule {}
