import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovAportesComponent } from './componentes/lov.aportes.component'; 

const routes: Routes = [
  {
    path: '', component: LovAportesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovAportesRoutingModule {}
