import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovRentavariableComponent } from './componentes/lov.rentavariable.component';

const routes: Routes = [
  {
    path: '', component: LovRentavariableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovRentavariableRoutingModule {}