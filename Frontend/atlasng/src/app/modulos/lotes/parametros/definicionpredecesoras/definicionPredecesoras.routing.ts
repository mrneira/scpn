import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefinicionPredeComponent } from './componentes/definicionPredecesoras.component';

const routes: Routes = [
  { path: '', component: DefinicionPredeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefinicionPredecesoraRoutingModule {}
