import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendapagosComponent } from './componentes/agendapagos.component';

const routes: Routes = [
  { path: '', component: AgendapagosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendapagosRoutingModule {}
