import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuncionarionominaComponent } from './componentes/funcionaridecimos.component';

const routes: Routes = [
  { path: '', component: FuncionarionominaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionarioDecimoRoutingModule {}
