import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RubrosOperacionComponent } from './componentes/_rubrosOperacion.component';

const routes: Routes = [
  {
    path: '', component: RubrosOperacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubrosOperacionRoutingModule { }
