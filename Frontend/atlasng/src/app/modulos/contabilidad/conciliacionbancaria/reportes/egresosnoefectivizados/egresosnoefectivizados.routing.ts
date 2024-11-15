import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EgresosnoefectivizadosComponent } from './componentes/egresosnoefectivizados.component';

const routes: Routes = [
  { path: '', component: EgresosnoefectivizadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EgresosnoefectivizadosRoutingModule {}
