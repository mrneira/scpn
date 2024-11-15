import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovFuncionariosComponent } from './componentes/lov.funcionarios.component';

const routes: Routes = [
  {
    path: '', component: LovFuncionariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovFuncionariosRoutingModule {}
