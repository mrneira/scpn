import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TesoreriaComponent } from './componentes/tesoreria.component';

const routes: Routes = [
  { path: '', component: TesoreriaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule {}
