import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidacionespecialComponent } from './componentes/validacionespecial.component';

const routes: Routes = [
  { path: '', component: ValidacionespecialComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidacionespecialRoutingModule {}
