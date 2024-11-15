import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegularizacionPresupuestariaComponent } from '../regularizacionpresupuestaria/componentes/regularizacionpresupuestaria.component';

const routes: Routes = [
  { path: '', component: RegularizacionPresupuestariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegularizacionPresupuestariaRoutingModule {}
