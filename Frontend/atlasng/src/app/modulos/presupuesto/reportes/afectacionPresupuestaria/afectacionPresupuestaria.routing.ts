import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfectacionPresupuestariaComponent } from './componentes/afectacionPresupuestaria.component';

const routes: Routes = [
  { path: '', component: AfectacionPresupuestariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AfectacionPresupuestariaRoutingModule {}
