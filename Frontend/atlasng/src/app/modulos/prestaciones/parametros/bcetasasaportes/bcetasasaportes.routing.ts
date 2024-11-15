import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BcetasasaportesComponent } from './componentes/bcetasasaportes.component';

const routes: Routes = [
  { path: '', component: BcetasasaportesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BcetasasaportesRoutingModule {}
