import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagodecimoComponent } from './componentes/pagodecimo.component';

const routes: Routes = [
  { path: '', component: PagodecimoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagodecimoRoutingModule {}
