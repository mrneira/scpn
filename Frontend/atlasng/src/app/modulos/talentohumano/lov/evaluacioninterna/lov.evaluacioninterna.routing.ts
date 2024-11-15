import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovEvaluacionInternaComponent } from './componentes/lov.evaluacioninterna.component';

const routes: Routes = [
  {
    path: '', component: LovEvaluacionInternaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovEvaluacionInternaRoutingModule {}
