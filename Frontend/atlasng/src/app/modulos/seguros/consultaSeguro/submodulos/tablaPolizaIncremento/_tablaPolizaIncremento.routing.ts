import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablaPolizaIncrementoComponent } from './componentes/_tablaPolizaIncremento.component';

const routes: Routes = [
  { path: '', component: TablaPolizaIncrementoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablaPolizaIncrementoRoutingRouting {}
