import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignacionCobranzasComponent } from './componentes/asignacionCobranzas.component';

const routes: Routes = [
  { path: '', component: AsignacionCobranzasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionCobranzasRoutingModule {}
