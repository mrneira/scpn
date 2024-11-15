import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacacionesComponent } from './componentes/vacaciones.component';

const routes: Routes = [
  { path: '', component: VacacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacacionesRoutingModule {}
