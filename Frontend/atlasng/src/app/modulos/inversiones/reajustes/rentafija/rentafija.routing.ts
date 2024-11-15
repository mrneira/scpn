import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentafijaComponent } from './componentes/rentafija.component';

const routes: Routes = [
  { path: '', component: RentafijaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentafijaRoutingModule {}
