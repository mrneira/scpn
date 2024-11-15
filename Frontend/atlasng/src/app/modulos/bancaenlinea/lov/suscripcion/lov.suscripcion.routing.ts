import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovSuscripcionComponent } from './componentes/lov.suscripcion.component';

const routes: Routes = [
  {
    path: '', component: LovSuscripcionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovSuscripcionRoutingModule {}
