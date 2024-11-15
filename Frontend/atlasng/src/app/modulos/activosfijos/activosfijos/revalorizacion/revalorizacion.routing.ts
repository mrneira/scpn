import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevalorizacionComponent } from './componentes/revalorizacion.component';

const routes: Routes = [
  { path: '', component: RevalorizacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevalorizacionRoutingModule {}
