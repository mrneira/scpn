import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablaAccionesCobranzaComponent } from './componentes/_tablaAccionesCobranza.component';

const routes: Routes = [
  { path: '', component: TablaAccionesCobranzaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablaAccionesCobranzaRoutingRouting {}
