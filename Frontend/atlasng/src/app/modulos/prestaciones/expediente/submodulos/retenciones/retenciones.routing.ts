import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetencionesComponent } from './componentes/retenciones.component';

const routes: Routes = [
  { path: '', component: RetencionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetencionesRoutingModule {}
