import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstructuraCarteraRComponent } from './componentes/estructuraCarteraR.component';

const routes: Routes = [
  {
    path: '', component: EstructuraCarteraRComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstructuraCarteraRRoutingModule { }
