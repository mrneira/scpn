import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagosrfComponent } from './componentes/pagosrf.component';

const routes: Routes = [
  { path: '', component: PagosrfComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosrfRoutingModule {}
