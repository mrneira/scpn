import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevAporteComponent } from './componentes/devaporte.component';

const routes: Routes = [
  { path: '', component: DevAporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevAporteRoutingModule {}
