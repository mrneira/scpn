import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagomoraComponent } from './componentes/pagomora.component';

const routes: Routes = [
  { path: '', component: PagomoraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagomoraRoutingModule {}
