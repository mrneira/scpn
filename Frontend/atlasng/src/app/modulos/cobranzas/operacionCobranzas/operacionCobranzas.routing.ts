import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperacionCobranzasComponent } from './componentes/operacionCobranzas.component';

const routes: Routes = [
  { path: '', component: OperacionCobranzasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionCobranzasRoutingModule {}
