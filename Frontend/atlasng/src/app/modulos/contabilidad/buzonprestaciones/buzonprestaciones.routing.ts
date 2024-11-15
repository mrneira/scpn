import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuzonprestacionesComponent } from './componentes/buzonprestaciones.component';

const routes: Routes = [
  { path: '', component: BuzonprestacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuzonprestacionesRoutingModule {}
