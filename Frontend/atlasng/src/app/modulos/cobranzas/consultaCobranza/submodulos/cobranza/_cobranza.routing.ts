import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CobranzaComponent } from './componentes/_cobranza.component';

const routes: Routes = [
  { path: '', component: CobranzaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobranzaRoutingRouting {}
