import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParametrosCuantiaComponent } from './componentes/parametroscuantia.component';

const routes: Routes = [
  { path: '', component: ParametrosCuantiaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosCuantiaRoutingModule {}
