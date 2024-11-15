import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovSuscripcionMovilComponent } from './componentes/lov.suscripcionMovil.component';

const routes: Routes = [
  {
    path: '', component: LovSuscripcionMovilComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovSuscripcionMovilRoutingModule {}
