import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovProcesoComponent } from './componentes/lov.proceso.component';

const routes: Routes = [
  {
    path: '', component: LovProcesoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovProcesoRoutingModule {}
