import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarteraIsspolComponent } from './componentes/carteraIsspol.component';

const routes: Routes = [
  {
    path: '', component: CarteraIsspolComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteraIsspolRoutingModule { }
