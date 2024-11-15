import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeguroRubrosComponent } from './componentes/seguroRubros.component';

const routes: Routes = [
  {
    path: '', component: SeguroRubrosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguroRubrosRoutingModule { }
