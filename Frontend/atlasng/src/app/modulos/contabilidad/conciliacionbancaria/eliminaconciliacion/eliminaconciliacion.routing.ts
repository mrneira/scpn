import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminaconciliacionComponent } from './componentes/eliminaconciliacion.component';

const routes: Routes = [
  { path: '', component: EliminaconciliacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EliminaconciliacionRoutingModule {}
