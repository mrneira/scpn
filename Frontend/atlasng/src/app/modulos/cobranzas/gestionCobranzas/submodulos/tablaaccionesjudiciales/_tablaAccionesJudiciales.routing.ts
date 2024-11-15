import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablaAccionesJudicialesComponent } from './componentes/_tablaAccionesJudiciales.component';

const routes: Routes = [
  { path: '', component: TablaAccionesJudicialesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablaAccionesJudicialesRoutingRouting {}
