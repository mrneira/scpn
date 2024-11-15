import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReversoCarteraComponent } from './componentes/reversoCartera.component';

const routes: Routes = [
  { path: '', component: ReversoCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReversoCarteraRoutingModule {}
