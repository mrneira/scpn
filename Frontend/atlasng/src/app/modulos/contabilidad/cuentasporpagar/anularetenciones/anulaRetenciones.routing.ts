import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnulaRetencionesComponent } from './componentes/anulaRetenciones.component';

const routes: Routes = [
  { path: '', component: AnulaRetencionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnulaRetencionesRoutingModule {}
