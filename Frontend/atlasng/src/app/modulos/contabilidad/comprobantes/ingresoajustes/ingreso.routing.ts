import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoAjustesComponent } from './componentes/ingresoajustes.component';

const routes: Routes = [
  { path: '', component: IngresoAjustesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoAjustesRoutingModule {}
