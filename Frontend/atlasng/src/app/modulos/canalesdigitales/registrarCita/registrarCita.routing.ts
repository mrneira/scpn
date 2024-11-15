import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarCitaComponent } from './componentes/registrarCita.component';

const routes: Routes = [
  {
    path: '', component: RegistrarCitaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrarCitaRoutingModule { }
