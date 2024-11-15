import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JubilacionvalidacionComponent } from './componentes/jubilacionvalidacion.component';

const routes: Routes = [
  { path: '', component: JubilacionvalidacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JubilacionvalidacionRoutingModule {}
