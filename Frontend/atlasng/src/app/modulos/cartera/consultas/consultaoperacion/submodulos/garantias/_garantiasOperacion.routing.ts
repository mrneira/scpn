import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GarantiasOperacionComponent } from './componentes/_garantiasOperacion.component';

const routes: Routes = [
  { path: '', component: GarantiasOperacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarantiasOperacionRoutingModule {}
