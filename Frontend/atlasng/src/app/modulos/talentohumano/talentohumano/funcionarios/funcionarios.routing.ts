import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuncionariosComponent } from './componentes/funcionarios.component';

const routes: Routes = [
  { path: '', component: FuncionariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionariosRoutingModule {}
