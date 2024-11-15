import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecepcionSegurosComponent } from './componentes/recepcionSeguros.component';

const routes: Routes = [
  { path: '', component: RecepcionSegurosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionSegurosRoutingModule {}
