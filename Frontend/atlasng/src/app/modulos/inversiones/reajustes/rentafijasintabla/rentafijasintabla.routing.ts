import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentafijasintablaComponent } from './componentes/rentafijasintabla.component';

const routes: Routes = [
  { path: '', component: RentafijasintablaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentafijasintablaRoutingModule {}
