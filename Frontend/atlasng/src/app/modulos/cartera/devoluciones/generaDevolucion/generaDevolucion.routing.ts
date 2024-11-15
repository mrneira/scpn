import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneraDevolucionComponent } from './componentes/generaDevolucion.component';

const routes: Routes = [
  {
    path: '', component: GeneraDevolucionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneraDevolucionRoutingModule { }
