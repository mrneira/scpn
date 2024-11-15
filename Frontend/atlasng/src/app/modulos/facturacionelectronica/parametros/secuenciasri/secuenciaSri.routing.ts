import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecuenciaSriComponent } from './componentes/secuenciaSri.component';

const routes: Routes = [
  { path: '', component: SecuenciaSriComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule {}
