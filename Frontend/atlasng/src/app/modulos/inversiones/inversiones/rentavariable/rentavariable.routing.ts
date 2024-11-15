import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentavariableComponent } from './componentes/rentavariable.component';

const routes: Routes = [
  { path: '', component: RentavariableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentavariableRoutingModule {}
