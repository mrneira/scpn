import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagosrvComponent } from './componentes/pagosrv.component';

const routes: Routes = [
  { path: '', component: PagosrvComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosrvRoutingModule {}
