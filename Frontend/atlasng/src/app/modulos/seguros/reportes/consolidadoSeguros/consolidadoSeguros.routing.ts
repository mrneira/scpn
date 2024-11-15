import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsolidadoSegurosComponent } from './componentes/consolidadoSeguros.component';

const routes: Routes = [
  { path: '', component: ConsolidadoSegurosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolidadoSegurosRoutingModule {}
