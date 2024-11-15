import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrelacionCobroComponent } from './componentes/prelacionCobro.component';

const routes: Routes = [
  {
    path: '', component: PrelacionCobroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrelacionCobroRoutingModule { }
