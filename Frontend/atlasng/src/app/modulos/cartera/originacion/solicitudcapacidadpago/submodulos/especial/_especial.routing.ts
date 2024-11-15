import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EspecialComponent } from './componentes/_especial.component';

const routes: Routes = [
  {
    path: '', component: EspecialComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspecialRoutingModule { }
