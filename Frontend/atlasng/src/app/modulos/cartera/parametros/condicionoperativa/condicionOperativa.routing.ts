import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CondicionOperativaComponent } from './componentes/condicionOperativa.component';

const routes: Routes = [
  { path: '', component: CondicionOperativaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionOperativaRoutingModule {}
