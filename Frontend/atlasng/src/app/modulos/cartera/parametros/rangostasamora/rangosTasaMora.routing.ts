import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RangosTasaMoraComponent } from './componentes/rangosTasaMora.component';

const routes: Routes = [
  { path: '', component: RangosTasaMoraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RangosTasaMoraRoutingModule {}
