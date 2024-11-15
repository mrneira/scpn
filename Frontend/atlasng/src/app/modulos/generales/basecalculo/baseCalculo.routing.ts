import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseCalculoComponent } from './componentes/baseCalculo.component';

const routes: Routes = [
  { path: '', component: BaseCalculoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseCalculoRoutingModule {}
