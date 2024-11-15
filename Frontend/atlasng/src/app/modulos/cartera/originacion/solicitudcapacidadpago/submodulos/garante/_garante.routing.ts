import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GaranteComponent } from './componentes/_garante.component';

const routes: Routes = [
  {
    path: '', component: GaranteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaranteRoutingModule { }
