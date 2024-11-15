import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenDescuentosComponent } from './componentes/resumenDescuentos.component';

const routes: Routes = [
  {
    path: '', component: ResumenDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenDescuentosRoutingModule { }
