import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacacionComponent } from './componentes/vacacion.component';

const routes: Routes = [
  { path: '', component: VacacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacacionRoutingModule {}
