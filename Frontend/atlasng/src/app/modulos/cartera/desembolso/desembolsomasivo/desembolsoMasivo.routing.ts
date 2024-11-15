import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesembolsoMasivoComponent } from './componentes/desembolsoMasivo.component';

const routes: Routes = [
  {
    path: '', component: DesembolsoMasivoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesembolsoMasivoRoutingModule { }
