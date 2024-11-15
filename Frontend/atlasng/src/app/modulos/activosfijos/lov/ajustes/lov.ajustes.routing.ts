import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovAjustesComponent } from './componentes/lov.ajustes.component';

const routes: Routes = [
  {
    path: '', component: LovAjustesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovAjustesRoutingModule {}
