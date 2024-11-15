import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovSegurosComponent } from './componentes/lov.seguros.component';

const routes: Routes = [
  {
    path: '', component: LovSegurosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovSegurosRoutingModule { }
