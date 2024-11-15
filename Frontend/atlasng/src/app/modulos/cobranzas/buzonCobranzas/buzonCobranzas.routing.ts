import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuzonCobranzasComponent } from './componentes/buzonCobranzas.component';

const routes: Routes = [
  {
    path: '', component: BuzonCobranzasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuzonCobranzasRoutingModule { }
