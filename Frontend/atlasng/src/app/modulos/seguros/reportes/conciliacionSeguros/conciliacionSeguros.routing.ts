import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConciliacionSegurosComponent } from './componentes/conciliacionSeguros.component';

const routes: Routes = [
  { path: '', component: ConciliacionSegurosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConciliacionSegurosRoutingModule {}
