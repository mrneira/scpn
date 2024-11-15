import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaDevolucionComponent } from './componentes/consultaDevolucion.component';

const routes: Routes = [
  {
    path: '', component: ConsultaDevolucionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaDevolucionRoutingModule { }
