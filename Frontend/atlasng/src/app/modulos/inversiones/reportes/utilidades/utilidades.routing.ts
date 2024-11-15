import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UtilidadesComponent } from './componentes/utilidades.component';

const routes: Routes = [
  { path: '', component: UtilidadesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilidadesRoutingModule {}
