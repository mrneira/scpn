import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoMigradasJudicialesComponent } from './componentes/pagomigradasjudiciales.component';

const routes: Routes = [
  { path: '', component: PagoMigradasJudicialesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoMigradasJudicialesRoutingModule {}
