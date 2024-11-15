import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricoCarreraComponent } from './componentes/historicoCarrera.component';

const routes: Routes = [
  { path: '', component: HistoricoCarreraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricoCarreraRoutingModule {}
