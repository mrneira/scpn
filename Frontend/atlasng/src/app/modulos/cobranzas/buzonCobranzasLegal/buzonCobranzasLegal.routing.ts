import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuzonCobranzasLegalComponent } from './componentes/buzonCobranzasLegal.component';

const routes: Routes = [
  {
    path: '', component: BuzonCobranzasLegalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuzonCobranzasLegalRoutingModule { }
