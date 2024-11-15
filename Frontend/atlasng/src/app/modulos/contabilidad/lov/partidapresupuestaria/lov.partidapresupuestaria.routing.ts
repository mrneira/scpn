import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPartidaPresupuestariaComponent } from './componentes/lov.partidapresupuestaria.component';

const routes: Routes = [
  {
    path: '', component: LovPartidaPresupuestariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPartidaPresupuestariaRoutingModule {}
