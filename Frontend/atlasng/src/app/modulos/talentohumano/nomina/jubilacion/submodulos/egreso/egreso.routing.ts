import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EgresoComponent } from './componentes/egreso.component';

const routes: Routes = [
  { path: '', component: EgresoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EgresoRoutingModule {}
