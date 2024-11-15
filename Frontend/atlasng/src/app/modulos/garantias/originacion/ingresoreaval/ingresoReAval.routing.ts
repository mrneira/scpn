import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoReAvalComponent } from './componentes/ingresoReAval.component';

const routes: Routes = [
  { path: '', component: IngresoReAvalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoReAvalRoutingModule {}
