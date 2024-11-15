import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevAporteAnterioresComponent } from './componentes/devaporteAnteriores.component';

const routes: Routes = [
  { path: '', component: DevAporteAnterioresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevAporteAnterioresRoutingModule {}
