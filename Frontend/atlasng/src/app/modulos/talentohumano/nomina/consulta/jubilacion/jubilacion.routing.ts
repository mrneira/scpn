import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JubilacionComponent } from './componentes/jubilacion.component';

const routes: Routes = [
  { path: '', component: JubilacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JubilaciopnRoutingModule {}
