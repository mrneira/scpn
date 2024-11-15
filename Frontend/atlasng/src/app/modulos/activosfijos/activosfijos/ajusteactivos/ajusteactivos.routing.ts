import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjusteActivosComponent } from './componentes/ajusteactivos.component';

const routes: Routes = [
  { path: '', component: AjusteActivosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjusteActivosRoutingModule {}
