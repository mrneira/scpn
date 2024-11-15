import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargarDescuentosComponent } from './componentes/cargarDescuentos.component';

const routes: Routes = [
  {
    path: '', component: CargarDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargarDescuentosRoutingModule { }
