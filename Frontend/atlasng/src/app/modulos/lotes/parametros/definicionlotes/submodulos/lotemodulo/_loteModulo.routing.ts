import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoteModuloComponent } from './componentes/_loteModulo.component';

const routes: Routes = [
  { path: '', component: LoteModuloComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoteModuloRoutingModule {}
