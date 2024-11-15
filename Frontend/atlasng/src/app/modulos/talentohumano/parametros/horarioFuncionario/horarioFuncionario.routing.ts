import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorarioFuncionarioComponent } from './componentes/horarioFuncionario.component';

const routes: Routes = [
  { path: '', component: HorarioFuncionarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorarioFuncionarioRoutingModule {}
