import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletarCarteraComponent } from './componentes/completarCartera.component';

const routes: Routes = [
  {
    path: '', component: CompletarCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompletarCarteraRoutingModule { }
