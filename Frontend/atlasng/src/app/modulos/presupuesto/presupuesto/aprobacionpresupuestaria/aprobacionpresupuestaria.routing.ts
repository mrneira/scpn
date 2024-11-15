import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprobacionPresupuestariaComponent } from './componentes/aprobacionpresupuestaria.component';

const routes: Routes = [
  { path: '', component: AprobacionPresupuestariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobacionPresupuestariaRoutingModule {}
