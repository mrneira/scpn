import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaEquifaxComponent } from './componentes/consultaEquifax.component';

const routes: Routes = [
  { path: '', component: ConsultaEquifaxComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaEquifaxRoutingModule {}
