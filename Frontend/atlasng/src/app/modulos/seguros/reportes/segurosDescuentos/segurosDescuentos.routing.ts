import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SegurosDescuentosComponent } from './componentes/segurosDescuentos.component';

const routes: Routes = [
  {
    path: '', component: SegurosDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegurosDescuentosRoutingModule { }
