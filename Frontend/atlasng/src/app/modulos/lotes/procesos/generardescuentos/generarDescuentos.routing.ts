import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarDescuentosComponent } from './componentes/generarDescuentos.component';

const routes: Routes = [
  {
    path: '', component: GenerarDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarDescuentosRoutingModule { }
