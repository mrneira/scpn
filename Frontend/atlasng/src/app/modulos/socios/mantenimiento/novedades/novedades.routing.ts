import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovedadesComponent } from './componentes/novedades.component';

const routes: Routes = [
  { path: '', component: NovedadesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovedadesRoutingModule {}
