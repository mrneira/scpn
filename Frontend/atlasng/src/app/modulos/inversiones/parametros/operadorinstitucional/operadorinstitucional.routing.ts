import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperadorinstitucionalComponent } from './componentes/operadorinstitucional.component';

const routes: Routes = [
  { path: '', component: OperadorinstitucionalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperadorinstitucionalRoutingModule {}
