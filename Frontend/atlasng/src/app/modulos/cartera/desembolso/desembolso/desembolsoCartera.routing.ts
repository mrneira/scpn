import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesembolsoCarteraComponent } from './componentes/desembolsoCartera.component';

const routes: Routes = [
  { path: '', component: DesembolsoCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesembolsoCarteraRoutingModule {}
