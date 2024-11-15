import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VectorpreciosComponent } from './componentes/vectorprecios.component';

const routes: Routes = [
  { path: '', component: VectorpreciosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VectorpreciosRoutingModule {}
