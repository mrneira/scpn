import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendimientorentaFijaComponent } from './componentes/rendimientorentafija.component';

const routes: Routes = [
  { path: '', component: RendimientorentaFijaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RendimientorentaFijaRoutingModule {}
