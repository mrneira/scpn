import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldosSegurosComponent } from './componentes/saldosSeguros.component';

const routes: Routes = [
  {
    path: '', component: SaldosSegurosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldosSegurosRoutingModule { }
