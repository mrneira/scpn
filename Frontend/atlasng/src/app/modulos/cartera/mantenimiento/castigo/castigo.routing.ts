import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CastigoComponent } from './componentes/castigo.component';

const routes: Routes = [
  { path: '', component: CastigoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CastigoRoutingModule {}
