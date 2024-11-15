import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagocxpComponent } from './componentes/pagocxp.component';

const routes: Routes = [
  { path: '', component: PagocxpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagocxpRoutingModule {}
