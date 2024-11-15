import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinDiaComponent } from './componentes/finDia.component';

const routes: Routes = [
  { path: '', component: FinDiaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinDiaRoutingModule {}
