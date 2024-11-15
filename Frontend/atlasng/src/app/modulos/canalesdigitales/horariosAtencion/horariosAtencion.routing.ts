import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorariosAtencionComponent } from './componentes/horariosAtencion.component';

const routes: Routes = [
  {
    path: '', component: HorariosAtencionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorariosAtencionRoutingModule { }
